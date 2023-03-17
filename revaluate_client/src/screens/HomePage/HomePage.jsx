import React from 'react';
import {useState} from 'react';
import './HomePage.css'
import { Stack,Grid,Button,ThemeProvider, createTheme, InputLabel, NativeSelect} from '@mui/material';
import {ToggleButton,ToggleButtonGroup} from '@mui/material';


function HomePage() {
    const[formats, setFormats] = useState()
    const handleFormatChange = (event,updatedFormat) =>{
        if(updatedFormat !== null)
        setFormats(updatedFormat)
    }  

     const theme = createTheme({
     palette: {
      primary: {
      main: '#f16209'
      }}});
    return (<Grid container>

        
        <Grid item xs={7}>

            <Grid item xs={8}>
            <p style={{fontSize: 50,textAlign: "left", marginTop: '150px', marginLeft:'50px', fontWeight:'bold'}}>
                <font color = "darkcyan">
                     Find the fair value of a house today!
                </font>
            </p>  
            </Grid>
  
            <Grid style={{textAlign:'left', marginTop:'70px', marginLeft:'50px'}}>
                <p style={{fontSize:25}}>
                    I am looking to
                </p>

                <Stack direction='row'>
                    <ToggleButtonGroup aria-label='selection' value={formats} onChange={handleFormatChange} color="success" exclusive size='large'>

                    <ToggleButton value = 'buy' aria-label='buy' style={{fontSize:18}}> Buy a house </ToggleButton>
                    <ToggleButton value = 'sell' aria-label='sell'style={{fontSize:18}}> Sell a house </ToggleButton>
                    
                    </ToggleButtonGroup>
                
                </Stack>
                

                <p>
                <InputLabel htmlFor="select1" style={{marginTop:40}}>Housing District</InputLabel>
                <NativeSelect id="select1" value={formats} exclusive onChange={handleFormatChange}>
                  <option value="option1">Option1</option>
                  <option value="option2">Option2</option>
                  <option value="option3">Option3</option>
                </NativeSelect>
                </p>

                <p>
                <InputLabel htmlFor="select2" style={{marginTop:40}}>Neighbourhood</InputLabel>
                <NativeSelect id="select2" value={formats} exclusive onChange={handleFormatChange}>
                  <option value="option1">Option1</option>
                  <option value="option2">Option2</option>
                  <option value="option3">Option3</option>
                </NativeSelect>
                </p>

                <p>
                <InputLabel htmlFor="select3" style={{marginTop:40}}>House Type</InputLabel>
                <NativeSelect id="select3" value={formats} exclusive onChange={handleFormatChange}> 
                    <option value="1bhk">1BHK</option>
                    <option value="2bhk">2BHK</option>
                    <option value="3bhk">3BHK</option> 
                    <option value="4bhk">4BHK</option>
                    <option value="5bhk">5BHK</option>
                </NativeSelect>
                </p>


                <p style={{marginTop:50}}>
                    <ThemeProvider theme={theme}>
                    <Button variant="contained" sx={{borderRadius: 50}}>Get Price</Button>
                    </ThemeProvider>
                </p>


            </Grid>

        </Grid>
        <Grid item xs={5}>
            <img src={require('./houseVectorImg.png')} alt={'house img'} className='homeImg' />
        </Grid>
    </Grid>)
}

export default HomePage;