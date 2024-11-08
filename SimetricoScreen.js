// SimetricoScreen.js
import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, ScrollView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import CryptoJS from 'react-native-crypto-js';

export default function SimetricoScreen() {
    const [password, setPassword] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [rutaArchivoCifrado, setRutaArchivoCifrado] = useState('');
    const [rutaArchivoDescifrado, setRutaArchivoDescifrado] = useState('');
    const [extensionArchivo, setExtensionArchivo] = useState('');

    // Función para seleccionar el archivo
    const seleccionarArchivo = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({});
            if (!res.canceled && res.assets && res.assets.length > 0) {
                const archivoSeleccionado = res.assets[0];
                setArchivo(archivoSeleccionado);
                
                // Extraer y guardar la extensión del archivo
                const extension = archivoSeleccionado.name.split('.').pop();
                setExtensionArchivo(extension);

                Alert.alert('Archivo seleccionado', `Has seleccionado: ${archivoSeleccionado.name}`);
            } else {
                Alert.alert('Cancelado', 'Ningún archivo fue seleccionado');
            }
        } catch (err) {
            Alert.alert('Error', 'Hubo un problema al seleccionar el archivo');
            console.error(err);
        }
    };

    // Función para cifrar el archivo y guardarlo
    const cifrarArchivoAES = async () => {
        if (!archivo) {
            Alert.alert('Error', 'Por favor, selecciona un archivo primero.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            // Leer el contenido del archivo en base64
            const fileData = await FileSystem.readAsStringAsync(archivo.uri, { encoding: FileSystem.EncodingType.Base64 });
            // Cifrar el contenido del archivo en base64
            const cifrado = CryptoJS.AES.encrypt(fileData, password).toString();
            const path = `${FileSystem.documentDirectory}archivo_cifrado.aes`;

            // Guardar el archivo cifrado en el sistema de archivos
            await FileSystem.writeAsStringAsync(path, cifrado, { encoding: FileSystem.EncodingType.UTF8 });
            Alert.alert('Éxito', `Archivo cifrado guardado en: ${path}`);
            setRutaArchivoCifrado(path);
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al cifrar el archivo');
            console.error(error);
        }
    };

    // Función para descifrar el archivo y guardarlo con su extensión original
    const descifrarArchivoAES = async () => {
        if (!rutaArchivoCifrado) {
            Alert.alert('Error', 'No hay un archivo cifrado para descifrar.');
            return;
        }
        if (password.length < 8) {
            Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        try {
            // Leer el archivo cifrado
            const cifrado = await FileSystem.readAsStringAsync(rutaArchivoCifrado, { encoding: FileSystem.EncodingType.UTF8 });
            // Intentar descifrar el contenido con la contraseña proporcionada
            const bytes = CryptoJS.AES.decrypt(cifrado, password);
            const descifrado = bytes.toString(CryptoJS.enc.Utf8);

            if (!descifrado) {
                Alert.alert('Error', 'Contraseña incorrecta');
                return;
            }

            // Convertir de base64 a binario para guardar en el formato original
            const path = `${FileSystem.documentDirectory}archivo_descifrado.${extensionArchivo}`;

            await FileSystem.writeAsStringAsync(path, descifrado, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert('Éxito', `Archivo descifrado guardado en: ${path}`);
            setRutaArchivoDescifrado(path);
        } catch (error) {
            Alert.alert('Error', 'La contraseña o el archivo cifrado no son correctos');
            console.error(error);
        }
    };

    // Función para compartir el archivo cifrado
    const compartirArchivoCifrado = async () => {
        if (!rutaArchivoCifrado) {
            Alert.alert('Error', 'No hay un archivo cifrado para compartir.');
            return;
        }

        try {
            // Compartir el archivo cifrado
            await Sharing.shareAsync(rutaArchivoCifrado);
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al compartir el archivo cifrado');
            console.error(error);
        }
    };

    // Función para compartir el archivo descifrado
    const compartirArchivoDescifrado = async () => {
        if (!rutaArchivoDescifrado) {
            Alert.alert('Error', 'No hay un archivo descifrado para compartir.');
            return;
        }

        try {
            // Compartir el archivo descifrado
            await Sharing.shareAsync(rutaArchivoDescifrado);
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al compartir el archivo descifrado');
            console.error(error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Cifrado Simétrico (AES) de Archivos</Text>
            <Button title="Seleccionar Archivo" onPress={seleccionarArchivo} />
            <Text style={styles.fileInfo}>
                {archivo ? `Archivo seleccionado: ${archivo.name}` : 'Ningún archivo seleccionado'}
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Contraseña (mínimo 8 caracteres)"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Cifrar Archivo con AES" onPress={cifrarArchivoAES} />
            <Text style={styles.fileInfo}>
                {rutaArchivoCifrado ? `Archivo cifrado guardado en: ${rutaArchivoCifrado}` : ''}
            </Text>
            <Button title="Compartir Archivo Cifrado" onPress={compartirArchivoCifrado} />
            <Button title="Descifrar Archivo con AES" onPress={descifrarArchivoAES} />
            <Text style={styles.fileInfo}>
                {rutaArchivoDescifrado ? `Archivo descifrado guardado en: ${rutaArchivoDescifrado}` : ''}
            </Text>
            <Button title="Compartir Archivo Descifrado" onPress={compartirArchivoDescifrado} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, backgroundColor: '#f4f4f9', alignItems: 'center' },
    header: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50', marginVertical: 10 },
    input: { width: '100%', padding: 10, borderColor: '#ddd', borderWidth: 1, borderRadius: 5, marginVertical: 10 },
    fileInfo: { marginVertical: 10, fontSize: 16, color: '#333' },
});
