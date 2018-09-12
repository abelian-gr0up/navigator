/**
 * Navigator - A JS Single-Page Library
 * @author Felix Rewer <felix@rewer.com>
 * @copyright Felix Rewer 2018
 * @version 2.0
 * @license GPL-v3 LICENSE.md
 */

'use strict';

/**
 * Navigator Class
 * @class
 */
export class navigator {
    /**
     * @desc Constructor
     * @constructs navigator
     * @param {Object} confObj - Configuration Object
     * @param {string} confObj.root - Root folder
     * @param {string} confObj.links - Selector for NavLinks
     * @param {string} confObj.output - Selector for the output
     * @param {string} confObj.standard - Standard NavURL
     * @param {string} [confObj.extension=html] - File extension for navigations (e.g. php)
     */
    constructor(confObj) {
        this.root = confObj.root;
        this.links = confObj.links;
        this.extension = confObj.extension || 'html';

        document.addEventListener('DOMContentLoaded', () => {
            this.output = document.querySelector(confObj.output);
            this.navLinks(document.querySelectorAll(this.links));

            window.location.pathname === '/' ?
                this.navigate(confObj.standard) :
                this.navigate(window.location.pathname, window.location.search);
        });

        window.addEventListener('popstate', () => {
            this.navigate(window.history.state.page);
        });
    }

    /**
     * @func
     * @desc NavLinks initialization
     * @param {NodeListOf<HTMLElemen>} navLinksList - List with all NavLinks
     */
    navLinks(navLinksList) {
        Array.from(navLinksList).forEach(el => {
            el.addEventListener('click', e => {
                e.preventDefault();
                var navURL = el.getAttribute('href');

                var state = {
                    page: navURL,
                    host: window.location.host,
                    port: window.location.port
                };
                window.history.pushState(state, navURL, navURL);

                this.navigate(navURL);
            });
        });
    };

    /**
     * @func
     * @desc Navigate by URL
     * @param {string} navURL - URL to Navigate (e.g. /start)
     * @param {string} navURLSearchParams - SearchParams to attach to URL (e.g. ?id=1)
     * @async
     */
    navigate(navURL, navURLSearchParams = false) {
        var navArray = navURL.split('?');
        navURL = navArray[0];
        navURLSearchParams =
            navArray[1] === undefined ? navURLSearchParams : '?' + navArray[1];

        fetch(
                navURLSearchParams ?
                `../${this.root}${navURL}/index.${this.extension}${navURLSearchParams}` :
                `../${this.root}${navURL}/index.${this.extension}`
            )
            .then(response => response.text())
            .then(text => {
                this.output.innerHTML = text;
                this.navLinks(this.output.querySelectorAll(this.links));
            })
            .catch(error => {
                throw new Error(error);
            });
    };
}