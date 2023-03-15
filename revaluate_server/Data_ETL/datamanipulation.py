import csv
from ssl import CERT_NONE
import certifi
import requests
import time
import pymongo

#---EXTRACT---#
transactionData = []
filenames = ['mar2012-dec2014.csv', 'jan2015-dec2016.csv', 'jan2017onwards.csv']
count = 0

#---TRANSFORM---#
for filename in filenames:
    with open('data/' + filename, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            #older table missing the remaining_lease column
            if filename == 'mar2012-dec2014.csv':
                remainingLease = 99 - (int(row['month'][:4]) - int(row['lease_commence_date']))
                row['remaining_lease'] = remainingLease
            address = (row['block'] + ' ' + row['street_name']).split()
            for idx in range(len(address)):
                if address[idx] == "ST":
                    address[idx] = 'STREET'
            address = str(address)
            query = 'https://developers.onemap.sg/commonapi/search?searchVal="' + address + '"&returnGeom=Y&getAddrDetails=Y&pageNum={1}'
            try:
                count += 1
                res = requests.get(query)
                data = res.json()['results'][0]
                transactionData.append(row)
                row['postal_code'] = data['POSTAL']
                row['latitude'] = data['LATITUDE']
                row['longitude'] = data['LONGITUDE']
            except:
                print(query)
                print(count)
            if count == 250:
                time.sleep(60) #pause for 1 min as there is a maximum of 250 API calls per minute
                count = 0
        file.close()

#---LOAD---#
#rewrite the file each time it opens the file
with open('data/consolidatedData.csv', mode='a') as file:
    columnNames = transactionData[0].keys()
    writer = csv.DictWriter(file, fieldnames=columnNames)

    #writer.writeheader()
    writer.writerows(transactionData)

    file.close()

#upload content in csv file to mongodb
with open('credentials.csv', mode='r') as file:
    reader = csv.reader(file)
    for row in reader:
        mongoLink = row[0]
mongoConnection = pymongo.MongoClient(mongoLink, tlsCAFile=certifi.where())
database = mongoConnection['REvaluate']
collection = database['transactionsData']
columnName = ['month','town','flat_type','block','street_name','storey_range','floor_area_sqm','flat_model','lease_commence_date','resale_price','remaining_lease','postal_code','latitude','longitude']
with open('data/consolidatedData.csv', mode='r') as file:
    reader = csv.DictReader(file)
    count = 0
    for row in reader:
        count += 1
        jsonData = {}
        jsonData['_id'] = count
        for col in columnName:
            jsonData[col] = row[col]
        try:
            collection.insert_one(jsonData)
        except:
            print(jsonData)