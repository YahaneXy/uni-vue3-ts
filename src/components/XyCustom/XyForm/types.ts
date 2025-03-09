import { type XyFormProps } from './XyForm';
import { type XyFormItemsProps, type XyFormItemValidateState } from './XyFormItems';
export type XyFormValidateResult = Array<{ prop?: string } & XyFormRulesItems>;
export type FormResultType<T extends boolean> = T extends true ? XyFormValidateResult : boolean;
export type XyFormContext = XyFormProps & {
	addField: (field: XyFormItemContext) => void;
	validate: <T extends boolean>(getError?: T) => Promise<FormResultType<T>>;
};
interface XyFormRulesItems {
	required?: boolean;
	message?: string;
	trigger?: validateParams;
	pattern?: RegExp;
}
export type XyFormRules<T extends object> = {
	[k in keyof T]: XyFormRulesItems[];
};
export type validateParams = 'blur' | 'change' | '';
export interface XyFormItemContext extends XyFormItemsProps {
	validateState: XyFormItemValidateState;
	validate: (status?: validateParams) => Promise<boolean>;
	rule?: XyFormRulesItems[];
}
