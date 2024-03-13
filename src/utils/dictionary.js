import {getDictionary,getDictionaryName} from '@/api/report/dictionary.js';
class Dictionary {
  async codeToName (dicId, codes) {
    const name = await getDictionaryName(dicId, codes);
    return name.data.value;
  }

  async specialCodeToName (dicName, codes) {
    const dicArr = [];
    const dicData = await (await getDictionary(dicName)).data;
    for (const val of codes) {
      // const dicName = ;
      for (const data of dicData) {
        if (val === data.code) {
          dicArr.push(data.name);
        }
      }
    }
    return dicArr.join(',');
  }
}
export default new Dictionary();
