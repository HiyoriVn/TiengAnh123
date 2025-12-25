// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // --- CÁC LUẬT ĐÃ ĐƯỢC NỚI LỎNG ---

      // Tắt lỗi khai báo biến mà không dùng (giúp bạn code dở dang không bị báo đỏ)
      '@typescript-eslint/no-unused-vars': 'off',

      // Tắt lỗi bắt buộc phải khai báo kiểu trả về cho hàm (giúp viết hàm nhanh hơn)
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // Tắt lỗi bắt buộc Interface phải có chữ I ở đầu
      '@typescript-eslint/interface-name-prefix': 'off',

      // Cho phép dùng kiểu 'any' (dù không khuyến khích nhưng newbie dùng cho dễ)
      '@typescript-eslint/no-explicit-any': 'off',

      // Cảnh báo nhẹ thay vì báo lỗi đỏ lòm với các Promise chưa await
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      // --- CÁC LUẬT MỚI THÊM VÀO ---
      '@typescript-eslint/no-unsafe-member-access': 'off',

      // Cấu hình Prettier để tự động căn chỉnh code và sửa lỗi xuống dòng trên Windows
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          trailingComma: 'all',
        },
      ],
    },
  },
);
