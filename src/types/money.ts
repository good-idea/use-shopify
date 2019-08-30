export interface MoneyV2 {
  amount: number
  currencyCode: CurrencyCode
}

export type CurrencyCode =
  | 'USD'
  // United States Dollars (USD).
  | 'EUR'
  // Euro (EUR).
  | 'GBP'
  // United Kingdom Pounds (GBP).
  | 'CAD'
  // Canadian Dollars (CAD).
  | 'AFN'
  // Afghan Afghani (AFN).
  | 'ALL'
  // Albanian Lek (ALL).
  | 'DZD'
  // Algerian Dinar (DZD).
  | 'AOA'
  // Angolan Kwanza (AOA).
  | 'ARS'
  // Argentine Pesos (ARS).
  | 'AMD'
  // Armenian Dram (AMD).
  | 'AWG'
  // Aruban Florin (AWG).
  | 'AUD'
  // Australian Dollars (AUD).
  | 'BBD'
  // Barbadian Dollar (BBD).
  | 'AZN'
  // Azerbaijani Manat (AZN).
  | 'BDT'
  // Bangladesh Taka (BDT).
  | 'BSD'
  // Bahamian Dollar (BSD).
  | 'BHD'
  // Bahraini Dinar (BHD).
  | 'BIF'
  // Burundian Franc (BIF).
  | 'BYR'
  // Belarusian Ruble (BYR).
  | 'BZD'
  // Belize Dollar (BZD).
  | 'BMD'
  // Bermudian Dollar (BMD).
  | 'BTN'
  // Bhutanese Ngultrum (BTN).
  | 'BAM'
  // Bosnia and Herzegovina Convertible Mark (BAM).
  | 'BRL'
  // Brazilian Real (BRL).
  | 'BOB'
  // Bolivian Boliviano (BOB).
  | 'BWP'
  // Botswana Pula (BWP).
  | 'BND'
  // Brunei Dollar (BND).
  | 'BGN'
  // Bulgarian Lev (BGN).
  | 'MMK'
  // Burmese Kyat (MMK).
  | 'KHR'
  // Cambodian Riel.
  | 'CVE'
  // Cape Verdean escudo (CVE).
  | 'KYD'
  // Cayman Dollars (KYD).
  | 'XAF'
  // Central African CFA Franc (XAF).
  | 'CLP'
  // Chilean Peso (CLP).
  | 'CNY'
  // Chinese Yuan Renminbi (CNY).
  | 'COP'
  // Colombian Peso (COP).
  | 'KMF'
  // Comorian Franc (KMF).
  | 'CDF'
  // Congolese franc (CDF).
  | 'CRC'
  // Costa Rican Colones (CRC).
  | 'HRK'
  // Croatian Kuna (HRK).
  | 'CZK'
  // Czech Koruny (CZK).
  | 'DKK'
  // Danish Kroner (DKK).
  | 'DOP'
  // Dominican Peso (DOP).
  | 'XCD'
  // East Caribbean Dollar (XCD).
  | 'EGP'
  // Egyptian Pound (EGP).
  | 'ETB'
  // Ethiopian Birr (ETB).
  | 'XPF'
  // CFP Franc (XPF).
  | 'FJD'
  // Fijian Dollars (FJD).
  | 'GMD'
  // Gambian Dalasi (GMD).
  | 'GHS'
  // Ghanaian Cedi (GHS).
  | 'GTQ'
  // Guatemalan Quetzal (GTQ).
  | 'GYD'
  // Guyanese Dollar (GYD).
  | 'GEL'
  // Georgian Lari (GEL).
  | 'HTG'
  // Haitian Gourde (HTG).
  | 'HNL'
  // Honduran Lempira (HNL).
  | 'HKD'
  // Hong Kong Dollars (HKD).
  | 'HUF'
  // Hungarian Forint (HUF).
  | 'ISK'
  // Icelandic Kronur (ISK).
  | 'INR'
  // Indian Rupees (INR).
  | 'IDR'
  // Indonesian Rupiah (IDR).
  | 'ILS'
  // Israeli New Shekel (NIS).
  | 'IQD'
  // Iraqi Dinar (IQD).
  | 'JMD'
  // Jamaican Dollars (JMD).
  | 'JPY'
  // Japanese Yen (JPY).
  | 'JEP'
  // Jersey Pound.
  | 'JOD'
  // Jordanian Dinar (JOD).
  | 'KZT'
  // Kazakhstani Tenge (KZT).
  | 'KES'
  // Kenyan Shilling (KES).
  | 'KWD'
  // Kuwaiti Dinar (KWD).
  | 'KGS'
  // Kyrgyzstani Som (KGS).
  | 'LAK'
  // Laotian Kip (LAK).
  | 'LVL'
  // Latvian Lati (LVL).
  | 'LBP'
  // Lebanese Pounds (LBP).
  | 'LSL'
  // Lesotho Loti (LSL).
  | 'LRD'
  // Liberian Dollar (LRD).
  | 'LTL'
  // Lithuanian Litai (LTL).
  | 'MGA'
  // Malagasy Ariary (MGA).
  | 'MKD'
  // Macedonia Denar (MKD).
  | 'MOP'
  // Macanese Pataca (MOP).
  | 'MWK'
  // Malawian Kwacha (MWK).
  | 'MVR'
  // Maldivian Rufiyaa (MVR).
  | 'MXN'
  // Mexican Pesos (MXN).
  | 'MYR'
  // Malaysian Ringgits (MYR).
  | 'MUR'
  // Mauritian Rupee (MUR).
  | 'MDL'
  // Moldovan Leu (MDL).
  | 'MAD'
  // Moroccan Dirham.
  | 'MNT'
  // Mongolian Tugrik.
  | 'MZN'
  // Mozambican Metical.
  | 'NAD'
  // Namibian Dollar.
  | 'NPR'
  // Nepalese Rupee (NPR).
  | 'ANG'
  // Netherlands Antillean Guilder.
  | 'NZD'
  // New Zealand Dollars (NZD).
  | 'NIO'
  // Nicaraguan Córdoba (NIO).
  | 'NGN'
  // Nigerian Naira (NGN).
  | 'NOK'
  // Norwegian Kroner (NOK).
  | 'OMR'
  // Omani Rial (OMR).
  | 'PAB'
  // Panamian Balboa (PAB).
  | 'PKR'
  // Pakistani Rupee (PKR).
  | 'PGK'
  // Papua New Guinean Kina (PGK).
  | 'PYG'
  // Paraguayan Guarani (PYG).
  | 'PEN'
  // Peruvian Nuevo Sol (PEN).
  | 'PHP'
  // Philippine Peso (PHP).
  | 'PLN'
  // Polish Zlotych (PLN).
  | 'QAR'
  // Qatari Rial (QAR).
  | 'RON'
  // Romanian Lei (RON).
  | 'RUB'
  // Russian Rubles (RUB).
  | 'RWF'
  // Rwandan Franc (RWF).
  | 'WST'
  // Samoan Tala (WST).
  | 'SAR'
  // Saudi Riyal (SAR).
  | 'STD'
  // Sao Tome And Principe Dobra (STD).
  | 'RSD'
  // Serbian dinar (RSD).
  | 'SCR'
  // Seychellois Rupee (SCR).
  | 'SGD'
  // Singapore Dollars (SGD).
  | 'SDG'
  // Sudanese Pound (SDG).
  | 'SYP'
  // Syrian Pound (SYP).
  | 'ZAR'
  // South African Rand (ZAR).
  | 'KRW'
  // South Korean Won (KRW).
  | 'SSP'
  // South Sudanese Pound (SSP).
  | 'SBD'
  // Solomon Islands Dollar (SBD).
  | 'LKR'
  // Sri Lankan Rupees (LKR).
  | 'SRD'
  // Surinamese Dollar (SRD).
  | 'SZL'
  // Swazi Lilangeni (SZL).
  | 'SEK'
  // Swedish Kronor (SEK).
  | 'CHF'
  // Swiss Francs (CHF).
  | 'TWD'
  // Taiwan Dollars (TWD).
  | 'THB'
  // Thai baht (THB).
  | 'TZS'
  // Tanzanian Shilling (TZS).
  | 'TTD'
  // Trinidad and Tobago Dollars (TTD).
  | 'TND'
  // Tunisian Dinar (TND).
  | 'TRY'
  // Turkish Lira (TRY).
  | 'TMT'
  // Turkmenistani Manat (TMT).
  | 'UGX'
  // Ugandan Shilling (UGX).
  | 'UAH'
  // Ukrainian Hryvnia (UAH).
  | 'AED'
  // United Arab Emirates Dirham (AED).
  | 'UYU'
  // Uruguayan Pesos (UYU).
  | 'UZS'
  // Uzbekistan som (UZS).
  | 'VUV'
  // Vanuatu Vatu (VUV).
  | 'VEF'
  // Venezuelan Bolivares (VEF).
  | 'VND'
  // Vietnamese đồng (VND).
  | 'XOF'
  // West African CFA franc (XOF).
  | 'YER'
  // Yemeni Rial (YER).
  | 'ZMW'
// Zambian Kwacha (ZMW).
