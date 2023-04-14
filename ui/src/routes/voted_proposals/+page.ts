import { initSyncDaoData } from '../../lib/utils/api.utils';

export async function load() {
	const daoData = await initSyncDaoData();
	const has_content = daoData.length > 0;
	return {
		proposals: has_content ? daoData[0] : [],
		choiceArray: has_content ? daoData[1] : []
	};
}