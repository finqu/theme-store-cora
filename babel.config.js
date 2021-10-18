module.exports = function (api) {

    api.cache(false);

    const presets = [
        [
            "@babel/preset-env"
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