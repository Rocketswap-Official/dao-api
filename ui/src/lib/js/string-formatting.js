export function format_wallet_address(vk){
    return `${vk.slice(0, 7)}...${vk.slice(-4)}`
}

export function tauhq_addresses(vk){
    return `https://www.tauhq.com/addresses/${vk}`
}