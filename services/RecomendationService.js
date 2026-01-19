import { where } from "sequelize";
import { ProductTFIDF, Product, ProductHistory, Category } from "../models/models.js";
import PersonService from "./PersonService.js";
import ProductService from "./ProductService.js";

const notWords = new Set([
  'и', 'да', 'но', 'за', 'под', 'я',
  'ты', 'он', 'она', 'мы', 'вы', 'они',
  'в', 'на', 'с', 'из', 'о', 'то',
  'как', 'чтобы', 'что', 'которая', 'который', 'это',
  'все', 'ли', 'или', 'также', 'тоже', 'всегда',
  'никогда', 'где', 'когда', 'пока', 'если', 'между',
  'после', 'до', 'перед', 'через', 'по', 'среди',
  'без', 'внутри', 'вне', 'ни', 'только', 'всё',
  'для', 'каждый', 'сам', 'этот', 'та', 'те',
  'чей', 'чья', 'чьи', 'такой', 'такова', 'такие',
  'всего', 'всех', 'несмотря', 'поскольку', 'вдруг', 'может',
  'раз', 'вполне', 'вроде', 'должен', 'должна', 'должны',
  'тут', 'там', 'поэтому', 'чтото', 'ктото', 'эти',
  'далее', 'просто', 'как-то', 'где-то', 'никто', 'некоторые',
  'всётаки', 'сколько', 'вместо', 'сравнению', 'разве', 'почему',
  'именно', 'подобно', 'ввиду', 'вместе', 'можно', 'однако',
  'первый', 'дальше', 'кроме', 'том', 'числе', 'не', 'случайно',
  'типа', 'даже', 'немного', 'быть', 'равно', 'сути',
  'наверное', 'доказать', 'отношение', 'кстати', 'любом', 'случае',
  'вопреки', 'опять', 'неужели', 'вот', 'напрямую', 'лучше',
  'скорее', 'когда-то', 'долго', 'ведь', 'сравнительно', 'так',
  'разных', 'различные', 'кому', 'внешние', 'доступно', 'поля',
  'здесь', 'обычно', 'стоит', 'большинство', 'порядка', 'подобные',
  'например', 'будто', 'почему-то', 'особенно', 'бывает', 'самом',
  'деле', 'любой'
]);

const kp = {
  a: 0.10, // count
  b: 0.25, // orders
  c: 0.05, // views
  d: 0.20, // favorite
  e: 0.40, // rate
};
const kg = {
  a: 0.05, // sells
  b: 0.10, // orders
  c: 0.35, // rates
  d: 0.50, // rate
};
const k = {
  a: 0.95, // personal
  b: 0.05, // general
};


// Функция для расчета TF
function calculateTF(term, document) {
  const words = document;
  const termCount = words.filter(word => word.toLowerCase() === term.toLowerCase()).length;
  return termCount / words.length;
}

// Функция для расчета IDF
function calculateIDF(term, documents) {
  const totalDocuments = documents.length;
  const containingDocuments = documents.filter(doc => doc.includes(term.toLowerCase())).length;
  return Math.log(totalDocuments / (containingDocuments || 1));
}

// Функция для расчета TF-IDF
function calculateTFIDF(term, document, documents) {
  const tf = calculateTF(term, document);
  const idf = calculateIDF(term, documents);
  return tf * idf;
}

// Функция для вычисления косинусного сходства
function cosineSimilarity(tfidfsA, tfidfsB) {
  const vectorA = tfidfsA.reduce((acc, cur) => {
    if (acc[cur.term]) {
      acc[cur.term] += cur.tfidf;
    } else {
      acc[cur.term] = cur.tfidf;
    }
    return acc;
  }, {});
  const vectorB = tfidfsB.reduce((acc, cur) => {
    if (acc[cur.term]) {
      acc[cur.term] += cur.tfidf;
    } else {
      acc[cur.term] = cur.tfidf;
    }
    return acc;
  }, {});
  const keys = Object.keys(vectorA);
  const keyB = Object.keys(vectorB);
  const dot = keys.reduce((acc, key) => acc + (vectorA[key] || 0) * (vectorB[key] || 0), 0);
  const modA = Math.sqrt(keys.reduce((acc, key) => acc + vectorA[key] * vectorA[key], 0));
  const modB = Math.sqrt(keyB.reduce((acc, key) => acc + vectorB[key] * vectorB[key], 0));
  return dot / (modA * modB) || 0;
}


class RecomendationService {
  async createAll() {
    const products = await Product.findAll();
    for (const product of products) {
      const tfidfProduct = await ProductTFIDF.findOne({ where: { productId: product.dataValues.id } })
      if (!tfidfProduct) {
        await ProductTFIDF.create({
          tfidfs: [{
            term: '',
            tfidf: 0.01
          }],
          productId: product.dataValues.id
        })
      }
    }

    this.updateAll();
    return {};
  }

  async createOne(productId) {
    const product = await ProductTFIDF.findOne({ where: { productId } });
    if (!product) {
      await ProductTFIDF.create({
        tfidfs: [{
          term: '',
          tfidf: 0.01
        }],
        productId
      })
    }

    this.updateAll();
    return {};
  }

  async getAll() {
    const products = await ProductTFIDF.findAll();
    return products;
  }

  async getSimularProductsByProductId(productId, personId) {
    const productsTFIDF = await ProductTFIDF.findAll({ include: Product });
    const productTFIDF = await ProductTFIDF.findOne({ where: { productId } });
    const simularTFIDF = productsTFIDF.map(x => ({
      productId: x.dataValues.productId,
      product: x.dataValues.product,
      cosSim: cosineSimilarity(productTFIDF.dataValues.tfidfs, x.dataValues.tfidfs)
    }));

    const result = simularTFIDF.sort((a, b) => b.cosSim - a.cosSim).map((x) => x.product.dataValues)

    const products3 = await ProductService.getAllByPersonId(1000, 1, personId);
    const products = products3.rows;
    const productsByIds = products.reduce((acc, cur) => {
      acc[cur.dataValues.id] = cur.dataValues;
      return acc;
    }, {});

    const result2 = result.map(x => productsByIds[x.id])

    return result2.filter(x => x.id != productId);
  }

  async getRecomendationByPersonId(personId) {
    // Приведение массива в объект с ключами в виде id продукта
    // const products2 = await Product.findAll();
    if (!personId) {
      const products4 = await ProductService.getAll();
      return products4.slice(0, 4);
    }
    const products3 = await ProductService.getAllByPersonId(1000, 1, personId);
    const products = products3.rows;
    const productsByKeys = products.reduce((acc, product) => {
      acc[product.dataValues.id] = product.dataValues;
      return acc;
    }, {});
    // return 4
    const productsHistory = await ProductHistory.findAll({ where: { personId }, include: Product });

    const productsHistoryByKeys = productsHistory.reduce((acc, product) => {
      acc[product.dataValues.productId] = product.dataValues;
      return acc;
    }, {});

    // Составление рекомендательного коеффициента для каждого продукта
    const productsRecomendations = products.reduce((acc, cur) => {
      const ph = productsHistoryByKeys[cur.dataValues.id] || {
        id: 0,
        count: 0,
        inOrderCount: 0,
        viewsCount: 0,
        isInFavorite: false,
        rate: 4,
        product: {
          dataValues: undefined
        }
      }; // product history

      // const p = ph.product.dataValues || {
      //   sellCount: 0,
      //   inOrdersCount: 0,
      //   commentsCount: 0,
      //   rate: 4,
      // }; // product
      const p = cur.dataValues;
      // console.log(cur.dataValues.sellCount);
      let kPersonal = kp.a * ph.count + kp.b * ph.inOrderCount + kp.c * ph.viewsCount + kp.d * Number(ph.isInFavorite) + kp.e * ((ph.rate || 4) - 3.9);
      if (ph.count == 0) {
        kPersonal += kp.c * 8 * ph.viewsCount + kp.d * 10 * Number(ph.isInFavorite)
      }
      const kGeneral = kg.a * p.sellCount + kg.b * p.inOrdersCount + kg.c * p.commentsCount + kg.d * ((p.rate || 4) - 3.9);
      const kResult = k.a * kPersonal + k.b * Math.max(Math.log2(kGeneral + 2), 0);
      // const kResult = k.a * kPersonal;
      // console.log(ph.id, ph.count, ph.inOrderCount, ph.viewsCount, ph.isInFavorite, ph.rate);
      console.log(p.id, kPersonal.toFixed(2), kGeneral.toFixed(2));
      acc[cur.dataValues.id] = kResult;
      return acc;
    }, {})

    // 
    const objectedProducts = Object.keys(productsRecomendations).map(x => ({
      productId: x,
      k: productsRecomendations[x]
    }));
    const sortedProducts = objectedProducts.sort((a, b) => b.k - a.k).slice(0, 4);


    // обновление рекомендательных коэффициентов для тех продуктов 
    // которые похожи на любимые продукты пользователя но которые
    // тот еще не покупал
    for (const productIdK of sortedProducts) {
      const simulars = await this.getSimularProductsByProductId(productIdK.productId, personId);
      const simularsFiltered = simulars.filter((x) => {
        if (productsHistoryByKeys[x.id] == undefined) {
          return true
        }
        return productsHistoryByKeys[x.id].count == 0
      });
      if (simularsFiltered.length != 0) {
        const simular = simularsFiltered[0];
        productsRecomendations[simular.id] += 0.7 * productsRecomendations[productIdK.productId];
      }
    }
    // console.log(productsRecomendations);
    // return []
    // составление отсортированного массива продуктов в порядке
    // убывания рекомендательного коэффициента
    const recomendationsEntries = Object.entries(productsRecomendations).sort((a, b) => b[1] - a[1]);
    const recomendations = recomendationsEntries.map(x => productsByKeys[x[0]]);
    console.log(recomendations.map(x => ({
      productId: x.id,
      name: x.name,
      rec: productsRecomendations[x.id]
    })));
    return recomendations;
  }

  async updateAll() {
    const products = await Product.findAll({ include: Category });
    const documents = products.map(product => {
      const categories = Object.entries(product.dataValues.categoryCharacteristics).flat().join(' ');
      const description = `${product.dataValues.name} ${product.dataValues.category.name} ${categories} ${product.dataValues.description}`;
      return {
        productId: product.dataValues.id,
        document: description
          .toLowerCase()
          .replaceAll(/[^a-zA-Zа-яА-ЯёЁ ]/g, '')
          .replaceAll(/\s+/g, ' ')
          .trim()
          .split(' ')
          .filter(word => !notWords.has(word))
          .filter(word => word.length > 1)
      }
    }
    );

    const documents2 = products.map(product =>
      product.dataValues.description
        .toLowerCase()
        .replaceAll(/[^a-zA-Zа-яА-ЯёЁ ]/g, '')
        .replaceAll(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(word => !notWords.has(word))
        .filter(word => word.length > 1)
    );

    const tfidfProductVectors = documents.map(product => {
      const productTerms = product.document;
      return {
        productId: product.productId,
        tfidfs: productTerms.map(term => ({
          term,
          tfidf: calculateTFIDF(term, product.document, documents2)
        }))
      }
    })

    for (const product of tfidfProductVectors) {
      const productTFIDF = await ProductTFIDF.findOne({ where: { productId: product.productId } })
      if (productTFIDF) {
        await ProductTFIDF.update({
          tfidfs: product.tfidfs,
          // productId: product.productId
        }, {
          where: { id: productTFIDF.dataValues.id }
        })
      }
    }

    return { message: "ok" };
  }
}

export default new RecomendationService;