import { AppBar, Toolbar, Typography, Button, Box, TextField, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';
import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import './homepage.css';

const HomePage = () => {
    const [bebida1, setBebida1] = useState(0);
    const [bebida2, setBebida2] = useState(0);
    const [bebida3, setBebida3] = useState(0);
    const [canIniciar, setCanIniciar] = useState(false);
    const [receivedData, setReceivedData] = useState(null);
    const [topic, setTopic] = useState('ProjetoRoboteco_ESP32:BEBIDA0_0');

    // Validation function for inputs
    const validateInputs = () => {
        return bebida1 >= 0 && bebida1 <= 7 && bebida2 >= 0 && bebida2 <= 7 && bebida3 >= 0 && bebida3 <= 7;
    };

    // Update canIniciar based on validation
    useEffect(() => {
        if (validateInputs()) {
            setCanIniciar(true);
        } else {
            setCanIniciar(false);
        }
    }, [bebida1, bebida2, bebida3]);

    // Fetch data from FastAPI
    const fetchData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/messages/${topic}`);
            const data = await response.json();
            setReceivedData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Post data to FastAPI with the correct topic
    const postData = async (topic, message) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    topic: topic,
                    message: message
                })
            });
            const data = await response.json();
            console.log('Message published:', data.message);
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };

    // Handle button click events and send the correct topic
    const handleIniciar = () => {
        console.log('Publishing INICIAR message');
        
        // Function to convert a number into a 3-bit binary string
        const convertToBinary = (value) => {
            return value.toString(2).padStart(3, '0'); // Ensure it's 3 digits long
        };
        
        // Convert bebida values to 3-bit binary strings
        const bebida1Binary = convertToBinary(bebida1);
        const bebida2Binary = convertToBinary(bebida2);
        const bebida3Binary = convertToBinary(bebida3);
        
        postData('ProjetoRoboteco_ESP32:INICIAR', '1')
        // Send each bit of the binary string to the respective topic
        postData('ProjetoRoboteco_ESP32:BEBIDA1_0', bebida1Binary[2]);
        postData('ProjetoRoboteco_ESP32:BEBIDA1_1', bebida1Binary[1]);
        postData('ProjetoRoboteco_ESP32:BEBIDA1_2', bebida1Binary[0]);
    
        postData('ProjetoRoboteco_ESP32:BEBIDA2_0', bebida2Binary[2]);
        postData('ProjetoRoboteco_ESP32:BEBIDA2_1', bebida2Binary[1]);
        postData('ProjetoRoboteco_ESP32:BEBIDA2_2', bebida2Binary[0]);
    
        postData('ProjetoRoboteco_ESP32:BEBIDA3_0', bebida3Binary[2]);
        postData('ProjetoRoboteco_ESP32:BEBIDA3_1', bebida3Binary[1]);
        postData('ProjetoRoboteco_ESP32:BEBIDA3_2', bebida3Binary[0]);
    };
    

    const handleReset = () => {
        console.log('Publishing RESET message');
        postData('ProjetoRoboteco_ESP32:RESET', '0');
    };

    const handleParar = () => {
        console.log('Publishing PARAR message');
        postData('ProjetoRoboteco_ESP32:PARAR', '1');
    };

    // Convert binary string to decimal
    const convertBinaryToDecimal = (binaryString) => {
        return parseInt(binaryString, 2);
    };

    return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px' }}>
            <AppBar position="fixed" sx={{ backgroundColor: '#00796b' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Typography variant="h5" sx={{ fontFamily: 'Roboto, sans-serif' }}>
                        Roboteco
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{
                textAlign: 'center',
                marginBottom: '50px',
                color: '#fff',
                background: 'linear-gradient(45deg, #00796b, #004d40)',
                padding: '80px 0',
            }}>
                <Typography variant="h3" sx={{
                    fontSize: '36px',
                    fontWeight: 700,
                    marginBottom: '20px',
                }}>
                    Escolha quantas doses de cada garrafa você quer
                </Typography>
                <Typography variant="h6" color="inherit" paragraph>
                    Discover the finest drinks and cocktails, expertly curated just for you.
                </Typography>

                {/* Input fields for Bebida1, Bebida2, Bebida3 */}
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} className="form-container">
                    <TextField
                        type="number"
                        label="Bebida 1"
                        value={bebida1}
                        onChange={(e) => setBebida1(Math.max(0, Math.min(7, e.target.value)))}
                    />
                    <TextField
                        type="number"
                        label="Bebida 2"
                        value={bebida2}
                        onChange={(e) => setBebida2(Math.max(0, Math.min(7, e.target.value)))}
                    />
                    <TextField
                        type="number"
                        label="Bebida 3"
                        value={bebida3}
                        onChange={(e) => setBebida3(Math.max(0, Math.min(7, e.target.value)))}
                    />
                </Box>

                <div sx={{ display: 'flex', flexDirection: 'row', gap: 2, justifyContent: 'center' }}>
                    <Button
                        className="bebidabotao"
                        variant="contained"
                        disabled={!canIniciar}
                        onClick={handleIniciar}
                    >
                        Iniciar
                    </Button>
                    <Button
                        className="bebidabotao"
                        variant="contained"
                        onClick={handleParar}
                    >
                        Parar
                    </Button>
                    <Button
                        className="bebidabotao"
                        variant="contained"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </Box>

            {/* Displaying received data */}
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={4}>
                        <Card sx={{
                            borderRadius: '12px',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                        }}>
                            <CardMedia
                                sx={{
                                    height: 300,
                                    objectFit: 'initial',
                                }}
                                image="https://cdn7.kiwilimon.com/recetaimagen/40577/640x640/54168.jpg.webp"
                                title="Cocktail 1"
                            />
                            <CardContent sx={{ padding: '15px', textAlign: 'center' }}>
                                <Typography sx={{
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    color: '#00796b',
                                }}>Cuba Zero</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    A refreshing minty cocktail with rum, lime, and sugar.
                                </Typography>
                                <Typography variant="h6">
                                    Bebida1: {receivedData ? convertBinaryToDecimal(receivedData['ProjetoRoboteco_ESP32:BEBIDA1_0'] + receivedData['ProjetoRoboteco_ESP32:BEBIDA1_1'] + receivedData['ProjetoRoboteco_ESP32:BEBIDA1_2']) : 'Loading...'}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Repeat similar code for Bebida2, Bebida3 */}
                </Grid>
            </Container>
        </div>
    );
};

export default HomePage;
