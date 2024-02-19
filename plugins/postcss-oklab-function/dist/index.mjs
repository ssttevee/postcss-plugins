import s from"@csstools/postcss-progressive-custom-properties";import{color as e,SyntaxFlag as t,serializeRGB as o,colorDataFitsRGB_Gamut as r,serializeP3 as a}from"@csstools/css-color-parser";import{hasFallback as l,hasSupportsAtRuleAncestor as i}from"@csstools/utilities";import{replaceComponentValues as n,parseCommaSeparatedListOfComponentValues as c,isFunctionNode as u,stringify as p}from"@csstools/css-parser-algorithms";import{tokenize as m}from"@csstools/css-tokenizer";const g=/\b(?:oklab|oklch)\(/i,f=/^(?:oklab|oklch)$/i,basePlugin=s=>({postcssPlugin:"postcss-oklab-function",Declaration:b=>{const y=b.value;if(!g.test(y))return;if(l(b))return;if(i(b,g))return;const v=m({css:y}),F=n(c(v),(s=>{if(!u(s)||!f.test(s.getName()))return;const r=e(s);return r&&!(r.syntaxFlags.has(t.Experimental)||r.syntaxFlags.has(t.HasNoneKeywords)||r.syntaxFlags.has(t.RelativeColorSyntax))?o(r):void 0})),x=p(F);if(x===y)return;let P=x;s?.subFeatures.displayP3&&(P=p(n(c(v),(s=>{if(!u(s)||!f.test(s.getName()))return;const l=e(s);return l&&!(l.syntaxFlags.has(t.Experimental)||l.syntaxFlags.has(t.HasNoneKeywords)||l.syntaxFlags.has(t.RelativeColorSyntax))?r(l)?o(l):a(l):void 0})))),b.cloneBefore({value:x}),s?.subFeatures.displayP3&&P!==x&&b.cloneBefore({value:P}),s?.preserve||b.remove()}});basePlugin.postcss=!0;const postcssPlugin=e=>{const t=Object.assign({enableProgressiveCustomProperties:!0,preserve:!1,subFeatures:{displayP3:!0}},e);return t.subFeatures=Object.assign({displayP3:!0},t.subFeatures),t.enableProgressiveCustomProperties&&(t.preserve||t.subFeatures.displayP3)?{postcssPlugin:"postcss-oklab-function",plugins:[s(),basePlugin(t)]}:basePlugin(t)};postcssPlugin.postcss=!0;export{postcssPlugin as default};
