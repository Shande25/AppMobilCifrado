// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import CryptoJS from 'react-native-crypto-js';
import JSEncrypt from 'jsencrypt';

export default function App() {
    const [password, setPassword] = useState('');
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

    const cifrarMensajeAES = () => {
        if (password.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }
        const cifrado = CryptoJS.AES.encrypt(mensaje, password).toString();
        setMensajeCifrado(cifrado);
    };

    const descifrarMensajeAES = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(mensajeCifrado, password);
            const descifrado = bytes.toString(CryptoJS.enc.Utf8);
            setMensajeDescifrado(descifrado || 'Error en el descifrado');
        } catch (error) {
            Alert.alert('Error', 'La contraseña o el mensaje cifrado no son correctos.');
        }
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
            <Text style={styles.header}>Cifrado Simétrico (AES)</Text>
            <TextInput
                style={styles.input}
                placeholder="Contraseña (mínimo 8 caracteres)"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <TextInput
                style={styles.input}
                placeholder="Mensaje a cifrar"
                onChangeText={setMensaje}
                value={mensaje}
            />
            <Button title="Cifrar con AES" onPress={cifrarMensajeAES} />
            <Button title="Descifrar con AES" onPress={descifrarMensajeAES} />

            <Text style={styles.label}>Mensaje Cifrado (AES):</Text>
            <TextInput style={styles.output} value={mensajeCifrado} editable={false} multiline />

            <Text style={styles.label}>Mensaje Descifrado (AES):</Text>
            <TextInput style={styles.output} value={mensajeDescifrado} editable={false} multiline />

            <Text style={styles.header}>Cifrado Asimétrico (RSA)</Text>
            <Button title="Generar Claves RSA" onPress={generarClaves} />

            <Text style={styles.label}>Clave Pública:</Text>
            <TextInput style={styles.output} value={clavePublica} editable={false} multiline />

            <Text style={styles.label}>Clave Privada:</Text>
            <TextInput style={styles.output} value={clavePrivada} editable={false} multiline />

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
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f4f4f9',
        alignItems: 'center',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginVertical: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
    },
    label: {
        marginTop: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    output: {
        width: '100%',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f4f4f4',
        marginVertical: 10,
    },
});
