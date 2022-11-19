import type { I_ChoicesObj } from '../../types/imported-types'

export const processChoices = (choices: I_ChoicesObj[]): string[] =>{
    let c: any = []
    for (let choice of choices){
        c.push(choice.text)
    }

    return c
}

