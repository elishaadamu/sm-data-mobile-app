import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const networkImages = {
  MTN: require('../../assets/networks/mtn.jpg'),
  AIRTEL: require('../../assets/networks/airtel.png'),
  GLO: require('../../assets/networks/glo.webp'),
  '9MOBILE': require('../../assets/networks/9mobile.png'),
};

const networks = [
  { name: 'MTN', identifier: 'MTN' },
  { name: 'Airtel', identifier: 'AIRTEL' },
  { name: 'Glo', identifier: 'GLO' },
  { name: '9Mobile', identifier: '9MOBILE' },
];

const NetworkSelector = ({ selected, onSelect }) => {
  return (
    <View style={styles.container}>
      {networks.map((net) => (
        <TouchableOpacity
          key={net.identifier}
          style={[
            styles.card,
            selected === net.identifier && styles.cardSelected,
          ]}
          onPress={() => onSelect(net.identifier)}
          activeOpacity={0.7}
        >
          <Image source={networkImages[net.identifier]} style={styles.image} />
          <Text
            style={[
              styles.name,
              selected === net.identifier && styles.nameSelected,
            ]}
          >
            {net.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  cardSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  nameSelected: {
    color: '#2563EB',
  },
});

export default NetworkSelector;
