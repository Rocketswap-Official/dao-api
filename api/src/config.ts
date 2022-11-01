export const config_prod = {
    app_name: "Lite Dao",
    dex_contract: "con_rocketswap_official_v1_1",
    staking_contract: "con_staking_rswp_rswp_interop_v2",
	lp_staking_contract: "con_liq_mining_rswp_rswp",
    dex_native_token: "con_rswp_lst001",
    dao_contract: "con_lite_dao",
    network_type: "mainnet",
    block_service_urls: process.env.block_service_urls?.split(",") || ["165.22.47.195:3535"]
    //block_service_url: process.env.BLOCK_SERVICE_URL || "0.0.0.0:3535"
};

export const getConfig = () => config_prod

export let config = getConfig();
