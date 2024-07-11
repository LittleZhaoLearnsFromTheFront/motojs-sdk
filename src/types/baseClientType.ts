import { BaseOptionsType } from ".";

export interface BaseClientType<O extends BaseOptionsType = BaseOptionsType> {
    SDK_NAME: string,
    SDK_VERSION: string,
    options: O,
    getOptions: () => O
}