// import { MoiSklad } from "../models/models.js";
import { Product, Order } from "../models/models.js";

const statesMeta = {
  // 'Отгружен': '2facba82-36d5-11f0-0a80-045100043a4d',
  'Ожидает оплаты': '2facb868-36d5-11f0-0a80-045100043a4a',
  'Подтвержден': '2facb9c8-36d5-11f0-0a80-045100043a4b',
  'Собран': '2facba2b-36d5-11f0-0a80-045100043a4c',
  'В пути': '2facba82-36d5-11f0-0a80-045100043a4d',
  'Доставлен': '2facbae4-36d5-11f0-0a80-045100043a4e',
  'Отменен': '2facbb87-36d5-11f0-0a80-045100043a50',
  'Возврат': '2facbb32-36d5-11f0-0a80-045100043a4f',
}

class MoiSkladService {
  async getAllProducts() {
    // const response = await fetch('https://api.moysklad.ru/api/remap/1.2/entity/product', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
    //   }
    // }).then(data => {
    //   return data.json();
    // })

    // const response = await fetch('https://api.moysklad.ru/api/remap/1.2/entity/customerorder', {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
    //   }
    // }).then(data => {
    //   return data.json();
    // })

    // const states = response.rows.map(x => x.state.meta.href)

    // const productNames = response.rows.map(x => ({
    //   name: x.name,
    //   skladId: x.id,
    //   skladCode: x.code
    // }));
    const order = await fetch('https://api.moysklad.ru/api/remap/1.2/entity/customerorder/10df0b46-386c-11f0-0a80-065e00172b54', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      },
    }).then(data => {
      return data.json();
    });

    // console.log(order);



    const response = await fetch('https://api.moysklad.ru/api/remap/1.2/entity/customerorder/10df0b46-386c-11f0-0a80-065e00172b54', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      },
      body: JSON.stringify({
        ...order,
        "state": {
          "meta": {
            "href": `https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/${statesMeta['Отгружен']}`,
            "metadataHref": "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata",
            "type": "state",
            "mediaType": "application/json"
          }
        }
      })
    })

    return response

    // return states;
  }

  async createProductsFromApi() {
    const response = await fetch('https://api.moysklad.ru/api/remap/1.2/entity/product', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      }
    }).then(data => {
      return data.json();
    })

    const productNames = response.rows.map(x => ({
      name: x.name,
      skladId: x.id,
      skladCode: x.code,
      price: Number(x.salePrices[0].value) / 100
    }));

    // return productNames;

    for (const product of productNames) {
      // сделать по коду
      await Product.create({
        name: product.name,
        price: product.price,
        categoryId: 1,
        skladCharacteristics: {
          id: product.skladId,
          code: product.skladCode
        }
      })

    }
    return response
  }

  async updateProductsReserveFromApi() {
    const response = await fetch('https://api.moysklad.ru/api/remap/1.2/report/stock/all', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      }
    }).then(data => {
      return data.json();
    })

    const productReserveByCode = response.rows
      .map(x => ({
        code: x.code,
        quantity: x.quantity
      }))
      .reduce((acc, cur) => {
        acc[cur.code] = cur.quantity;
        return acc;
      }, {})

    const products = await Product.findAll();
    console.log(products);

    for (const product of products) {
      await Product.update({
        productsCount: productReserveByCode[product.skladCharacteristics.code]
      }, {
        where: { id: product.id }
      })
      console.log(productReserveByCode[product.skladCharacteristics.code])
    }

    return productReserveByCode
  }


  async createOrder(order) {
    const response = await fetch('https://api.moysklad.ru/api/remap/1.2/entity/customerorder', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      },
      body: JSON.stringify({
        "organization": {
          "meta": {
            "href": "https://api.moysklad.ru/api/remap/1.2/entity/organization/2f8cc456-36d5-11f0-0a80-045100043a17",
            "type": "organization",
            "mediaType": "application/json"
          }
        },
        "agent": {
          "meta": {
            "href": "https://api.moysklad.ru/api/remap/1.2/entity/counterparty/2f8f508a-36d5-11f0-0a80-045100043a1d",
            "type": "counterparty",
            "mediaType": "application/json"
          }
        },
        positions: order.order_products.map(x => ({
          "quantity": x.count,
          "price": Number(x.product.price) * 100,
          "discount": 0,
          "vat": 0,
          "assortment": {
            "meta": {
              "href": `https://api.moysklad.ru/api/remap/1.2/entity/product/${x.product.skladCharacteristics.id}`,
              "type": "product",
              "mediaType": "application/json"
            }
          },
          "reserve": x.count
        }))
      })
    }).then(data => {
      return data.json();
    })


    await Order.update({
      skladCharacteristics: {
        id: response.id,
        name: response.name,
      }
    }, {
      where: { id: order.dataValues.id }
    });

    return response
  }


  async updateOrderStatus(orderId, status) {
    const orderDB = await Order.findByPk(orderId);

    const order = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/customerorder/${orderDB.dataValues.skladCharacteristics.id}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      },
    }).then(data => {
      return data.json();
    });

    const response = await fetch(`https://api.moysklad.ru/api/remap/1.2/entity/customerorder/${orderDB.dataValues.skladCharacteristics.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer b67de4de255620497e444de89a69c5ae8d87381f'
      },
      body: JSON.stringify({
        ...order,
        "state": {
          "meta": {
            "href": `https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/states/${statesMeta[status]}`,
            "metadataHref": "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata",
            "type": "state",
            "mediaType": "application/json"
          }
        }
      })
    })

    return response
  }

}



export default new MoiSkladService;