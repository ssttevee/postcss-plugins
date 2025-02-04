import { ComponentValue, ComponentValueType } from '@csstools/css-parser-algorithms';
import { CSSToken, TokenDelim, isTokenDelim } from '@csstools/css-tokenizer';

export enum MediaFeatureLT {
	LT = '<',
	LT_OR_EQ = '<=',
}

export enum MediaFeatureGT {
	GT = '>',
	GT_OR_EQ = '>=',
}

export enum MediaFeatureEQ {
	EQ = '=',
}

export type MediaFeatureComparison = MediaFeatureLT | MediaFeatureGT | MediaFeatureEQ

export function matchesComparison(componentValues: Array<ComponentValue>): false | [number, number] {
	let firstTokenIndex = -1;

	for (let i = 0; i < componentValues.length; i++) {
		const componentValue = componentValues[i];
		if (componentValue.type === ComponentValueType.Token) {
			const token = componentValue.value as CSSToken;
			if (isTokenDelim(token)) {
				if ((token[4].value as MediaFeatureComparison) === MediaFeatureEQ.EQ) {
					if (firstTokenIndex !== -1) {
						return [firstTokenIndex, i];
					}

					return [i, i];
				}
				if ((token[4].value as MediaFeatureComparison) === MediaFeatureLT.LT) {
					firstTokenIndex = i;
					continue;
				}
				if ((token[4].value as MediaFeatureComparison) === MediaFeatureGT.GT) {
					firstTokenIndex = i;
					continue;
				}
			}
		}

		break;
	}

	if (firstTokenIndex !== -1) {
		return [firstTokenIndex, firstTokenIndex];
	}

	return false;
}

export function comparisonFromTokens(tokens: [TokenDelim, TokenDelim] | [TokenDelim]): MediaFeatureComparison | false {
	if (tokens.length !== 1 && tokens.length !== 2) {
		return false;
	}

	if (!isTokenDelim(tokens[0])) {
		return false;
	}

	if (tokens.length === 1) {
		switch (tokens[0][4].value as MediaFeatureComparison) {
			case MediaFeatureEQ.EQ:
				return MediaFeatureEQ.EQ;
			case MediaFeatureLT.LT:
				return MediaFeatureLT.LT;
			case MediaFeatureGT.GT:
				return MediaFeatureGT.GT;
			default:
				return false;
		}
	}

	if (!isTokenDelim(tokens[1])) {
		return false;
	}

	if ((tokens[1][4].value as MediaFeatureComparison) !== MediaFeatureEQ.EQ) {
		return false;
	}

	switch (tokens[0][4].value as MediaFeatureComparison) {
		case MediaFeatureLT.LT:
			return MediaFeatureLT.LT_OR_EQ;
		case MediaFeatureGT.GT:
			return MediaFeatureGT.GT_OR_EQ;
		default:
			return false;
	}
}

export function invertComparison(operator: MediaFeatureComparison): MediaFeatureComparison | false {
	switch (operator) {
		case MediaFeatureEQ.EQ:
			return MediaFeatureEQ.EQ;
		case MediaFeatureLT.LT:
			return MediaFeatureGT.GT;
		case MediaFeatureLT.LT_OR_EQ:
			return MediaFeatureGT.GT_OR_EQ;
		case MediaFeatureGT.GT:
			return MediaFeatureLT.LT;
		case MediaFeatureGT.GT_OR_EQ:
			return MediaFeatureLT.LT_OR_EQ;
		default:
			return false;
	}
}
