module.exports = function (api) {

    api.cache(false);

    const presets = [
        [
            "@babel/preset-env", {
                "targets": "> 0.25%, not dead"
            }
        ]
    ];

    const plugins = [
        [
            "@babel/transform-runtime", {
                "corejs": 3
            }
        ]
    ];

    return {
        presets,
        plugins
    };
};