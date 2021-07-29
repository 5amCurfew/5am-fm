'use strict';

// Create an instance
var wavesurfer;

// Init & load audio file
document.addEventListener('DOMContentLoaded', function() {
    // Init
    wavesurfer = WaveSurfer.create({
        container: document.querySelector('#waveform'),
        waveColor: '#3F3F3F',
        progressColor: '#9F9F9F',
        cursorWidth: 2,
        cursorColor: 'red',
        barWidth: 3,
        barRadius: 3,
        barGap: 2
    });

    // Load audio from URL
    wavesurfer.load(`${document.location.origin}/song`);

    // Equalizer
    wavesurfer.on('ready', function() {
        let EQ = [
            {
                f: 32,
                type: 'lowshelf'
            },
            {
                f: 64,
                type: 'peaking'
            },
            {
                f: 125,
                type: 'peaking'
            },
            {
                f: 250,
                type: 'peaking'
            },
            {
                f: 500,
                type: 'peaking'
            },
            {
                f: 1000,
                type: 'peaking'
            },
            {
                f: 2000,
                type: 'peaking'
            },
            {
                f: 4000,
                type: 'peaking'
            },
            {
                f: 8000,
                type: 'peaking'
            },
            {
                f: 16000,
                type: 'highshelf'
            }
        ];

        // Create filters
        let filters = EQ.map(function(band) {
            let filter = wavesurfer.backend.ac.createBiquadFilter();
            filter.type = band.type;
            filter.gain.value = 0;
            filter.Q.value = 1;
            filter.frequency.value = band.f;
            return filter;
        });

        // Connect filters to wavesurfer
        wavesurfer.backend.setFilters(filters);

        // Bind filters to vertical range sliders
        let container = document.querySelector('#equalizer');
        filters.forEach(function(filter) {
            let input = document.createElement('input');
            input.classList.add('controller');

            Object.assign(input, {
                type: 'range',
                min: -40,
                max: 40,
                value: 0,
                title: filter.frequency.value
            });

            input.style.display = 'inline-flex';
            input.setAttribute('orient', 'vertical');
            wavesurfer.util.style(input, {
                webkitAppearance: 'slider-vertical'
            });
            container.appendChild(input);

            let onChange = function(e) {
                filter.gain.value = ~~e.target.value;
            };

            input.addEventListener('input', onChange);
            input.addEventListener('change', onChange);
        });

        // For debugging
        wavesurfer.filters = filters;
    });

    // Log errors
    wavesurfer.on('error', function(msg) {
        console.log(msg);
    });

    // Bind play/pause button
    document
        .querySelector('[data-action="play"]')
        .addEventListener('click', wavesurfer.playPause.bind(wavesurfer));

    // Progress bar
    (function() {
        const progressDiv = document.querySelector('#progress-bar');
        const progressBar = progressDiv.querySelector('.progress-bar');

        let showProgress = function(percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        let hideProgress = function() {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    })();
});
