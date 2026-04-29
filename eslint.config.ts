import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}']
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/first-attribute-linebreak': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'below'
        }
      ],
      // 'vue/html-closing-bracket-newline': [
      //   'error',
      //   {
      //     singleline: 'never',
      //     multiline: 'always',
      //     selfClosingTag: {
      //       singleline: 'never',
      //       multiline: 'always',
      //     },
      //   },
      // ],
      'vue/html-closing-bracket-spacing': [
        'error',
        {
          startTag: 'never',
          endTag: 'never',
          selfClosingTag: 'always'
        }
      ],
      // 'vue/html-indent': [
      //   'error',
      //   2,
      //   {
      //     attribute: 1,
      //     baseIndent: 1,
      //     closeBracket: 0,
      //     alignAttributesVertically: true,
      //   },
      // ],
      'vue/script-indent': [
        'error',
        2,
        {
          baseIndent: 0,
          switchCase: 1
        }
      ],
      indent: ['error', 2],
      'vue/html-quotes': ['error', 'double', { avoidEscape: false }],
      // 'vue/html-self-closing': [
      //   'error',
      //   {
      //     html: {
      //       void: 'never',
      //       normal: 'always',
      //       component: 'always',
      //     },
      //     svg: 'always',
      //     math: 'always',
      //   },
      // ],
      // 'vue/max-attributes-per-line': [
      //   'error',
      //   {
      //     singleline: {
      //       max: 5,
      //     },
      //     multiline: {
      //       max: 1,
      //     },
      //   },
      // ],
      'vue/mustache-interpolation-spacing': ['error', 'always'],
      'vue/multiline-html-element-content-newline': [
        'error',
        {
          ignoreWhenEmpty: true,
          allowEmptyLines: false
        }
      ],
      'vue/no-spaces-around-equal-signs-in-attribute': ['error'],
      'vue/html-comment-content-newline': [
        'error',
        {
          singleline: 'ignore',
          multiline: 'always'
        }
      ],
      'vue/html-comment-content-spacing': ['error', 'always'],
      'vue/html-comment-indent': ['error', 2],
      semi: ['error', 'never']
    }
  },

  skipFormatting
)
