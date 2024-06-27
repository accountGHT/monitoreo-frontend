/*eslint-disable*/
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle,
    Button, FormControl, Grid, TextField, Select, MenuItem, InputLabel, IconButton, Card, CardContent, Typography, CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPersonasForAutocomplete } from 'api/personas/personasApi';
import { getVehiculosForAutocomplete } from 'api/vehiculos/vehiculosApi';
import { createPatrullaje, getPatrullajesPorDistro, deletePatrullaje } from 'api/patrullajes-modal/patrullajesApi';

const ManageTeamModal = ({ open, onClose, teamData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [personas, setPersonas] = useState([]);
    const [vehiculos, setVehiculos] = useState([]);
    const [filteredVehiculos, setFilteredVehiculos] = useState([]);
    const [patrullajes, setPatrullajes] = useState([]);
    const [patrullajeType, setPatrullajeType] = useState('a pie');
    const [selectedPersonas, setSelectedPersonas] = useState([]);
    const [selectedConductor, setSelectedConductor] = useState(null);
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);

    useEffect(() => {
        if (open) {
            console.log('teamData en modal:', teamData);
            setIsLoading(true);
            getPersonasForAutocomplete()
                .then(response => setPersonas(response.data))
                .catch(error => console.error('Error fetching personas:', error))
                .finally(() => setIsLoading(false));

            getPatrullajesPorDistro(teamData.id)
                .then(response => setPatrullajes(response))
                .catch(error => console.error('Error fetching patrullajes:', error));

            getVehiculosForAutocomplete()
                .then(response => setVehiculos(response.data))
                .catch(error => console.error('Error fetching vehiculos:', error))
                .finally(() => setIsLoading(false));
        }
    }, [open]);

    useEffect(() => {
        // Filtrar vehículos según el tipo de patrullaje y que no estén ya seleccionados
        if (patrullajeType) {
            const filtered = vehiculos.filter(vehiculo => {
                if ((patrullajeType === 'auto' && vehiculo.tipo === 1) ||
                    (patrullajeType === 'motorizado' && vehiculo.tipo === 2) ||
                    (patrullajeType === 'camioneta' && vehiculo.tipo === 3)) {
                    // Verificar que el vehículo no esté ya seleccionado en los patrullajes actuales
                    const patrullajesActuales = getPatrullajesByType(patrullajeType);
                    const vehiculosSeleccionados = patrullajesActuales.map(patrullaje => patrullaje.vehiculo.id);
                    return !vehiculosSeleccionados.includes(vehiculo.id);
                }
                return false;
            });
            setFilteredVehiculos(filtered);
        } else {
            setFilteredVehiculos([]);
        }
    }, [patrullajeType, vehiculos, patrullajes]);


    useEffect(() => {
        // Filtrar personas que ya están enlistadas en el tipo de patrullaje actual
        const patrullajesActuales = getPatrullajesByType(patrullajeType);
        const personasOcupadas = patrullajesActuales.flatMap(patrullaje => [
            patrullaje.conductor?.id,
            patrullaje.acompañante?.id,
            patrullaje.acompañante2?.id,
            patrullaje.acompañante3?.id,
            patrullaje.acompañante4?.id,
            patrullaje.acompañante5?.id,
        ]).filter(Boolean);

        const personasDisponibles = personas.filter(persona => !personasOcupadas.includes(persona.id));
        setPersonas(personasDisponibles);
    }, [patrullajeType, patrullajes]);

    const handlePatrullajeChange = (event) => {
        setPatrullajeType(event.target.value);
        setSelectedPersonas([]);
        setSelectedConductor(null);
        setSelectedVehiculo(null);
    };

    const handleVehiculoChange = (event, newValue) => {
        setSelectedVehiculo(newValue);
    };

    const handlePersonasChange = (event, newValue) => {
        setSelectedPersonas(newValue);
    };

    const handleConductorChange = (event, newValue) => {
        setSelectedConductor(newValue);
    };

    const handleSave = () => {
        const distribution = {
            tipo_patrullaje_id: getPatrullajeTypeId(patrullajeType) || null,
            distribucion_personal_id: teamData.id,
            vehiculo_id: selectedVehiculo ? selectedVehiculo.id : null,
            conductor_id: selectedConductor ? selectedConductor.id : null,
            acompañante_id: selectedPersonas[0] ? selectedPersonas[0].id : null,
            acompañante2_id: selectedPersonas[1] ? selectedPersonas[1].id : null,
            acompañante3_id: selectedPersonas[2] ? selectedPersonas[2].id : null,
            acompañante4_id: selectedPersonas[3] ? selectedPersonas[3].id : null,
            acompañante5_id: selectedPersonas[4] ? selectedPersonas[4].id : null,
        };

        createPatrullaje(distribution)
            .then(response => {
                console.log('Distribución guardada:', response.data);
                getPatrullajesPorDistro(teamData.id)
                    .then(response => setPatrullajes(response))
                    .catch(error => console.error('Error fetching patrullajes:', error));
                setSelectedPersonas([]);
                setSelectedConductor(null);
                setSelectedVehiculo(null);
                toast.success(`Equipo de ${patrullajeType} añadido con éxito`);

            })
            .catch(error => console.error('Error saving distribution:', error));
    };

    const handleDelete = (id) => {
        deletePatrullaje(id)
            .then(() => {
                setPatrullajes(patrullajes.filter(patrullaje => patrullaje.id !== id));
                toast.success(`Equipo de ${patrullajeType} eliminado con éxito`);
            })
            .catch(error => console.error('Error deleting patrullaje:', error));
    };

    const getPatrullajeTypeId = (type) => {
        switch (type) {
            case 'a pie':
                return 33;
            case 'auto':
                return 34;
            case 'motorizado':
                return 35;
            case 'camioneta':
                return 36;
            case 'puntos fijos':
                return 72;
            default:
                return null;
        }
    };

    const getPersonasLimit = () => {
        switch (patrullajeType) {
            case 'a pie':
                return 1;
            case 'auto':
            case 'camioneta':
                return 3;
            case 'motorizado':
                return 1;
            case 'puntos fijos':
                return 1;
            default:
                return 0;
        }
    };

    const isConductorRequired = ['auto', 'motorizado', 'camioneta'].includes(patrullajeType);

    const getPatrullajesByType = (type) => {
        if (!Array.isArray(patrullajes)) {
            console.error('El parámetro "patrullajes" no es un array válido.');
            return []; // Retorna un array vacío si patrullajes no es un array válido
        }

        const typeId = getPatrullajeTypeId(type); // Función para obtener el ID del tipo de patrullaje

        if (typeId === null) {
            return []; // Retorna un array vacío si el tipo no es válido
        }

        return patrullajes.filter(patrullaje => patrullaje.tipo_patrullaje_id === typeId);
    };



    const resetForm = () => {
        setPatrullajeType('');
        setSelectedPersonas([]);
        setSelectedConductor(null);
        setSelectedVehiculo(null);
        setPersonas([]);
        setVehiculos([]);
        setPatrullajes([]);
    };

    useEffect(() => {
        if (!open) {
            resetForm();
        }
    }, [open]);


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Gestionar Equipo</DialogTitle>
            {isLoading ? (
                <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                </DialogContent>
            )
                : (
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="patrullaje-type-label">Tipo de Patrullaje</InputLabel>
                            <Select
                                labelId="patrullaje-type-label"
                                value={patrullajeType}
                                onChange={handlePatrullajeChange}
                            >
                                <MenuItem value="a pie">A pie</MenuItem>
                                <MenuItem value="auto">Auto</MenuItem>
                                <MenuItem value="motorizado">Motorizado</MenuItem>
                                <MenuItem value="camioneta">Camioneta</MenuItem>
                                <MenuItem value="puntos fijos">Puntos Fijos</MenuItem>
                            </Select>
                        </FormControl>

                        {isConductorRequired && (
                            <>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="vehiculo"
                                        options={filteredVehiculos}
                                        getOptionLabel={(option) => option.placa || ''}
                                        value={selectedVehiculo}
                                        onChange={handleVehiculoChange}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Vehículo"
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6} md={6}>
                                    <Autocomplete
                                        disablePortal
                                        id="conductor"
                                        options={personas}
                                        getOptionLabel={(option) => option.nombre_completo || ''}
                                        value={selectedConductor}
                                        onChange={handleConductorChange}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Conductor"
                                                variant="standard"
                                            />
                                        )}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} sm={6} md={6}>

                            <Autocomplete
                                disablePortal
                                id="personas"
                                multiple
                                options={personas}
                                getOptionLabel={(option) => option.nombre_completo || ''}
                                value={selectedPersonas}
                                onChange={handlePersonasChange}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Personas"
                                        variant="standard"
                                    />
                                )}
                            />
                        </Grid>

                        <p>Personas seleccionadas: {selectedPersonas.length}/{getPersonasLimit()}</p>

                        <h3>Equipos para {patrullajeType}</h3>
                        <ul>
                            {getPatrullajesByType(patrullajeType).length > 0 ? (
                                getPatrullajesByType(patrullajeType).map(patrullaje => (
                                    <Card key={patrullaje.id} style={{ marginBottom: '10px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '10px', background: '#ededed' }}>
                                        <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                            {patrullaje.conductor?.nombres && (
                                                <Typography style={{ marginBottom: '1px' }}>
                                                    Conductor: {`${patrullaje.conductor.nombres} ${patrullaje.conductor.p_apellido} ${patrullaje.conductor.s_apellido}`} | Placa: {patrullaje.vehiculo.placa}
                                                </Typography>
                                            )}
                                            {patrullaje.acompañante?.nombres && (
                                                <Typography style={{ marginBottom: '1px' }}>
                                                    Acompañante 1: {`${patrullaje.acompañante.nombres} ${patrullaje.acompañante.p_apellido} ${patrullaje.acompañante.s_apellido}`}
                                                </Typography>
                                            )}
                                            {patrullaje.acompañante2?.nombres && (
                                                <Typography style={{ marginBottom: '1px' }}>
                                                    Acompañante 2: {`${patrullaje.acompañante2.nombres} ${patrullaje.acompañante2.p_apellido} ${patrullaje.acompañante2.s_apellido}`}
                                                </Typography>
                                            )}
                                            {patrullaje.acompañante3?.nombres && (
                                                <Typography style={{ marginBottom: '1px' }}>
                                                    Acompañante 3: {`${patrullaje.acompañante3.nombres} ${patrullaje.acompañante3.p_apellido} ${patrullaje.acompañante3.s_apellido}`}
                                                </Typography>
                                            )}
                                            {patrullaje.acompañante4?.nombres && (
                                                <Typography style={{ marginBottom: '1px' }}>
                                                    Acompañante 4: {`${patrullaje.acompañante4.nombres} ${patrullaje.acompañante4.p_apellido} ${patrullaje.acompañante4.s_apellido}`}
                                                </Typography>
                                            )}
                                            {patrullaje.acompañante5?.nombres && (
                                                <Typography style={{ marginBottom: '1px' }}>
                                                    Acompañante 5: {`${patrullaje.acompañante5.nombres} ${patrullaje.acompañante5.p_apellido} ${patrullaje.acompañante5.s_apellido}`}
                                                </Typography>
                                            )}
                                            <IconButton aria-label="delete" onClick={() => handleDelete(patrullaje.id)} style={{ alignSelf: 'flex-end' }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <p>No hay equipos disponibles para '{patrullajeType}' en este momento.</p>
                            )}
                        </ul>

                    </DialogContent>
                )}
            <DialogActions sx={{ pt: 5 }}>
                <Button onClick={onClose} endIcon={<CancelIcon />} variant="contained"> Cancelar </Button>
                <Button onClick={handleSave} color="primary" startIcon={<SaveIcon />}
                    disabled={selectedPersonas.length > getPersonasLimit()} variant='contained'>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageTeamModal;
