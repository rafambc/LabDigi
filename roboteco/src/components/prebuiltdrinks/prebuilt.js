import { AppBar, Toolbar, Typography, Button, Box, TextField, Container, Grid, Card, CardContent, CardMedia } from '@mui/material';

const prebuild = () => {
    return (
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
                Bebida1:                                 </Typography>
        </CardContent>
    )
}

export default prebuild