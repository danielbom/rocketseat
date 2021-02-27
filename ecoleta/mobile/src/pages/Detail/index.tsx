import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { AppLoading } from 'expo';
import * as MailCompose from 'expo-mail-composer';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';

import * as api from '../../services/api';
import { Point, Item } from '../../types/db';

interface RouteParams {
  pointId: number
}

const Detail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams;

  const [data, setData] = useState<{ point: Point, items: Pick<Item, "title">[] }>();

  useEffect(() => {
    api.db.points.show(params.pointId).then(res => setData(res.data));
  }, []);

  if (!data) return <AppLoading />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color="#34CB79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{ uri: data.point.image }}
        />

        <Text style={styles.pointName}>
          {data.point.name}
        </Text>
        <Text style={styles.pointItems}>
          {data.items.map(i => i.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton
          style={styles.button}
          onPress={() => {
            const text = "Tenho interesse na coleta de resíduos";
            Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=${text}`);
          }}
        >
          <FontAwesome name="whatsapp" size={20} color="#FFF" />
          <Text style={styles.buttonText}>
            Whatsapp
          </Text>
        </RectButton>

        <RectButton
          style={styles.button}
          onPress={() => {
            MailCompose.composeAsync({
              subject: 'Interesse na coleta de resíduos',
              recipients: [data.point.email],
            });
          }}
        >
          <Icon name="mail" size={20} color="#FFF" />
          <Text style={styles.buttonText}>
            E-mail
          </Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 20,
  },

  pointImage: {
    resizeMode: 'cover',
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginTop: 32,
  },

  pointName: {
    color: '#322153',
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    marginTop: 24,
  },

  pointItems: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  address: {
    marginTop: 32,
  },

  addressTitle: {
    color: '#322153',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },

  addressContent: {
    fontFamily: 'Roboto_400Regular',
    lineHeight: 24,
    marginTop: 8,
    color: '#6C6C80'
  },

  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#999',
    paddingVertical: 20,
    paddingHorizontal: 32,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  button: {
    width: '48%',
    backgroundColor: '#34CB79',
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    marginLeft: 8,
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Roboto_500Medium',
  },
});

export default Detail;