import {Injectable} from '@nestjs/common';
import axios from "axios";

@Injectable()
export class ExternalApiService {

    async bringDataFromAPI(ticker: string, f: string, optional: string): Promise<any> {

        let financialApiUrl = process.env.FINANCIAL_API_URL;
        let financialApiKey = process.env.FINANCIAL_API_KEY;

        const url = `${financialApiUrl}/query?function=${f}&symbol=${ticker}${optional}&apikey=${financialApiKey}`;

        const axios = require('axios');

        const response = await axios.get(url);

        if(Object.keys(response.data).length === 0){
            throw new Error('no data found');
        }

        if(response.data['Note']){{
            throw new Error('API limit reached');}
        }

        return response.data;
    }

}
