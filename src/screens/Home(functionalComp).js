import React, { Component, useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button } from 'native-base';
import Header from '../components/Header'
import Footer from '../components/Footer'
import { getAllItem } from '../public/redux/actions/item'

// if (!Array.prototype.flatMap) {
//   Object.defineProperty(Array.prototype, 'flatMap', {
//     configurable: true,
//     writable: true,
//     value: function flatMap(callback, thisArg = undefined) {
//       return this.reduce((array, ...args) => {
//         const element = callback(...args);

//         if (Array.isArray(element)) array.push(...element);
//         else array.push(element);

//         return array;
//       }, []);
//     }
//   });
// }

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  let menuState, transformedArray, stickyHead = []
  menuState = useSelector(state => state.reItem.itemList)
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = () => {
      dispatch(getAllItem())
    }
    fetch()
  }, [])

  transformedArray = menuState.flatMap(({ items, ...o }) => [o, ...items])

  const angkaRP = (angka) => {
    var rupiah = '';
    var angkarev = angka.toString().split('').reverse().join('');
    for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
    return 'Rp. ' + rupiah.split('', rupiah.length - 1).reverse().join('');
  };

  const RefreshFunc =  () => {
    setIsLoading(true);
    dispatch(getAllItem())
    setIsLoading(false);
    // dispatch(getAllItem())
    //   .then(() => {
    //     setIsLoading(false);
    //   })
    //   .catch((error) => {
    //     alert(error)
    //   })
  }

  transformedArray.map(obj => {
    if (obj.price == null) {
      stickyHead.push(transformedArray.indexOf(obj));
    }
  });
  stickyHead.push(0);

  console.log('menu state', menuState)
  console.log('objectsss', transformedArray)
  console.log('keHead', stickyHead)

  const renderItem = ({ item }) => {
    if (item.price == null) {
      return (
        <ListItem itemDivider>
          <Text>{item.category_name}</Text>
        </ListItem>
      );
    } else {
      return (
        <ListItem onPress={() => alert("asd")} thumbnail>
          <Left >
            <Thumbnail square source={{ uri: `${item.item_image}` }} />
          </Left>
          <Body >
            <Text>{item.item_name}</Text>
            <Text note>{angkaRP(item.price)}</Text>
          </Body>
          <Right  >
            <Text>=></Text>
            <Text>=></Text>
          </Right>
        </ListItem>
      );
    }
  }
  return (
    <Container>
      <>
        <Header title="Menu List" />
        <FlatList
          refreshing={isLoading}
          onRefresh={RefreshFunc}
          data={transformedArray}
          renderItem={renderItem}
        // stickyHeaderIndices={stickyHead}
        />
        <Footer />
      </>
    </Container>
  )
}


