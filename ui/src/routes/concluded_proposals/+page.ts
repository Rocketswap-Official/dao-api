import { filterConcludedProposals } from '../../lib/utils/api.utils';

export async function load() {
	const daoData = await filterConcludedProposals();
	const has_content = daoData.length > 0;
	return {
		proposals: has_content ? daoData[0] : [],
		choiceArray: has_content ? daoData[1] : []
	};
}