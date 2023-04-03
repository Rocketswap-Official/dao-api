import { initSyncDaoData } from '../lib/utils/api.utils'
import { choice_array_store } from '../lib/store';
import { get } from 'svelte/store';

export async function load() {
    let daoData = await initSyncDaoData();
    if(daoData.length > 0){
        return {
            proposals: daoData[0],
            choiceArray: daoData[1]
            
        }
    }else{
        return {
            proposals: [],
            choiceArray: []
            
        } 
    }
}