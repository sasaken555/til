require('dotenv').load();

const csvFilePath = './AllDealList.csv';
const csv = require('csvtojson');

const cloudant_user = process.env.cloudant_username;
const cloudant_pass = process.env.cloudant_password;
const cloudant_host = process.env.cloudant_host;
const Cloudant = require('@cloudant/cloudant');
const cloudant = Cloudant(`https://${cloudant_user}:${cloudant_pass}@${cloudant_host}`);

// DB一覧取得
cloudant.db.list((err, allDbs) => {
  console.log('All my databases: %s', allDbs.join(', '));
});

// 使用するDBを指定
const deals = cloudant.db.use('deals');

/**
 * Cloudantにレコードをバルクロードする
 * @param {Object} docs JSONのレコードの集合
 */
function bulkInsert(docs) {
  deals.bulk({ docs: docs }, (err, body) => {
    if (err) {
      console.error(err);
    }
    // 挿入した値を返す
    console.log(body);
  });
}

// 配列分割の事前準備
const range = 500; // 分割するまとまりの数

// 500個ずつに分割してロード
csv()
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    for (let i = 0; i < Math.ceil(jsonObj.length / range); i++) {
      const j = i * range; // 始点のIndex
      const jsons = jsonObj.slice(j, j + range);
      bulkInsert(jsons);
    }
  });


