import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
} from '@mui/material';
import { cancelCommunicationsCenter } from 'api/communications-center/communicationsCenterApi';

const CommunicationsCancelForm = ({ open, handleClose, communicationId, fetchData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await cancelCommunicationsCenter(communicationId);
            console.log('Cancelación exitosa:', response);
            fetchData();
            handleClose();
        } catch (error) {
            console.error('Error al cancelar la comunicación:', error);
            setError('Ocurrió un error al cancelar la comunicación');
        }

        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Cancelar Comunicación</DialogTitle>
            <DialogContent>
                <Typography>
                    ¿Estás seguro de que deseas cancelar la incidencia n° {communicationId}?
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Cancelando...' : 'Confirmar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CommunicationsCancelForm;