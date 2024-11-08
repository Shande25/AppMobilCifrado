    // AsimetricoScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import JSEncrypt from 'jsencrypt';

export default function AsimetricoScreen() {
    const [mensaje, setMensaje] = useState('');
    const [mensajeCifrado, setMensajeCifrado] = useState('');
    const [mensajeDescifrado, setMensajeDescifrado] = useState('');
    const [clavePublica, setClavePublica] = useState('');
    const [clavePrivada, setClavePrivada] = useState('');

    const generarClaves = () => {
        const rsa = new JSEncrypt();
        rsa.getKey();
        setClavePublica(rsa.getPublicKey());
        setClavePrivada(rsa.getPrivateKey());
    };

    const cifrarMensajeRSA = () => {
        const rsa = new JSEncrypt();
        rsa.setPublicKey(clavePublica);
        const mensajeCifradoRSA = rsa.encrypt(mensaje);
        setMensajeCifrado(mensajeCifradoRSA);
    };

    const descifrarMensajeRSA = () => {
        const rsa = new JSEncrypt();
        rsa.setPrivateKey(clavePrivada);
        const mensajeDescifradoRSA = rsa.decrypt(mensajeCifrado);
        setMensajeDescifrado(mensajeDescifradoRSA || 'Error en el descifrado');
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Cifrado Asimétrico (RSA)</Text>
            <Button title="Generar Claves RSA" onPress={generarClaves} />

            <Text style={styles.label}>Clave Pública:</Text>
            <TextInput style={styles.output} value={clavePublica} editable={false} multiline />

            <Text style={styles.label}>Clave Privada:</Text>
            <TextInput style={styles.output} value={clavePrivada} editable={false} multiline />

            <TextInput
                style={styles.input}
                placeholder="Mensaje a cifrar"
                onChangeText={setMensaje}
                value={mensaje}
            />
            <Button title="Cifrar con RSA" onPress={cifrarMensajeRSA} />
            <Button title="Descifrar con RSA" onPress={descifrarMensajeRSA} />

            <Text style={styles.label}>Mensaje Cifrado (RSA):</Text>
            <TextInput style={styles.output} value={mensajeCifrado} editable={false} multiline />

            <Text style={styles.label}>Mensaje Descifrado (RSA):</Text>
            <TextInput style={styles.output} value={mensajeDescifrado} editable={false} multiline />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f4f4f9', alignItems: 'center' },
    header: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', marginVertical: 10 },
    input: { width: '100%', padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginVertical: 10 },
    label: { marginTop: 15, fontWeight: 'bold', color: '#333' },
    output: { width: '100%', padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, backgroundColor: '#f4f4f4', marginVertical: 10 },
});
