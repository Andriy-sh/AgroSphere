declare module 'react-select-country-list' {
  interface Country {
    value: string;
    label: string;
    flag: string;
  }

  interface CountryListData {
    data: Country[];
  }

  function countryList(options?: { locale?: string }): CountryListData;

  export default countryList;
}
