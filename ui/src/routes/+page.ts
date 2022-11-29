import { initSyncDaoData } from '../lib/utils/api.utils'
import { choice_array_store } from '../lib/store';
import { get } from 'svelte/store';

export async function load() {
    let daoData = await initSyncDaoData();

    return {
        proposals: daoData[0],
        choiceArray: daoData[1]
        
    };
}