import resolve from 'rollup-plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';

export default {
    input: 'ShadowEditor.PackageManager/src/index.js',
    output: {
        indent: '\t',
        format: 'umd',
        name: 'Shadow',
        file: 'ShadowEditor.PackageManager/dist/ShadowEditor.PackageManager.js'
    },
    treeshake: true,
    external: [],
    plugins: [
        postcss({
            extensions: ['.css'],
        }),
        resolve({
            customResolveOptions: {
                moduleDirectory: 'node_modules'
            }
        }),
        // copy({
        //     "./assets/": "./dist/assets/"
        // })
    ]
};
