module.exports = {
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
      'project': './tsconfig.eslint.json', // Required to have rules that rely on Types.
      'tsconfigRootDir': './'
    },
    'extends': [
      'plugin:@typescript-eslint/recommended', // Out of the box Typescript rules
      'standard', // Out of the box StandardJS rules
    ],
    'plugins': [
      '@typescript-eslint', // Let's us override rules below.
      'jest'
    ],
    'rules': {
      '@typescript-eslint/no-use-before-define': 'off', // Allows us to hoist variables and functions which I am a fan of, functions not variables that is.
      '@typescript-eslint/no-explicit-any': 'off', // Too strict for my case, sometimes I need an any type
      '@typescript-eslint/member-delimiter-style': ['error', { // Prevents us from using any delimiter for interface properties.
        'multiline': {
          'delimiter': 'none',
          'requireLast': false
        },
        'singleline': {
          'delimiter': 'comma',
          'requireLast': false
        }
			}],
			"indent": "off",
			"no-tabs": 0,
      '@typescript-eslint/indent': 'off', // This is the job of StandardJS, they are competing rules so we turn off the Typescript one.
      '@typescript-eslint/comma-spacing': "off",
      '@typescript-eslint/method-signature-style': "off",
      '@typescript-eslint/return-await': "off",
      '@typescript-eslint/restrict-template-expressions': "off",
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'no-unused-vars': 'off', // On the fence about using this one, sometimes we import a package that is never used directly.
      'node/no-unsupported-features/es-syntax': 'off', // Allows us to use Import and Export keywords.
			'no-undef': 'off',
			"no-useless-constructor": "off",
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
      "jest/valid-expect": "error",
    }
  }
