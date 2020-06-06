import React, { useEffect, useState} from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import api from '../services/api';

import dislike from '../assets/dislike.png';
import like from '../assets/like.png';
import logo from '../assets/logo.png';
import AsyncStorage from '@react-native-community/async-storage';

export default function Main({ navigation }) {
    const id = navigation.getParam('user');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: { user: id }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [id]);

    async function handleLike() {
        const [{ _id }, ...rest] = users;

        await api.post(`/devs/${_id}/likes`, null, {
            headers: { user: _id }
        });

        setUsers(rest);
    }

    async function handleDislike() {
        const [{ _id }, ...rest] = users;

        await api.post(`/devs/${_id}/dislikes`, null, {
            headers: { user: _id }
        });

        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();

        navigation.navigate('Login');
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image style={styles.logo} source={logo} />
            </TouchableOpacity>

            <View>

            </View>

            <View style={styles.cardsContainer}>
                { users.length === 0
                ? <Text style={styles.empty}>
                    Acabou :(
                </Text>
                : users.map((user, index) => (
                    <View style={[styles.card, { zIndex: users.length - index }]}>
                        <Image 
                            source={{ uri: user.avatar }}
                            style={styles.avatar}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.name}>{ user.name }</Text>
                            <Text
                                numberOfLines={3}
                                style={styles.bio}
                            >
                                { user.bio }
                            </Text>
                        </View>
                    </View>
                )) }
            </View>

            { users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity onPress={handleDislike} style={styles.button}>
                        <Image source={dislike}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLike} style={styles.button}>
                        <Image source={like}/>
                    </TouchableOpacity>
                </View>
            ) }
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    logo: {
        marginTop: 30
    },

    empty: {
        alignSelf: 'center',
        color: '#999',
        fontSize: 24,
        fontWeight: 'bold'
    },

    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    cardsContainer: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        maxHeight: 500,
    },

    card: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        margin: 30,
        overflow: 'hidden',
        position: 'absolute'
    },

    avatar: {
        flex: 1,
        height: 300
    },

    footer: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 15
    },

    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },

    bio: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },

    buttonsContainer: {
        flexDirection: 'row',
        marginBottom: 30
    },

    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        }
    },

});