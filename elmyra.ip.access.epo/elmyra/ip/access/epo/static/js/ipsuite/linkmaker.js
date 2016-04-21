// -*- coding: utf-8 -*-
// (c) 2013,2014 Andreas Motl, Elmyra UG

// Ipsuite.LinkMaker
(function(){

    // Initial Setup
    // -------------

    // setup courtesy of Backbone

    // Save a reference to the global object (`window` in the browser, `exports` on the server).
    var root = this;

    // The top-level namespace. All public Ipsuite classes and modules will
    // be attached to this. Exported for both the browser and the server.
    var Ipsuite;
    if (typeof exports !== 'undefined') {
        Ipsuite = exports;
    } else {
        Ipsuite = root.Ipsuite = {};
    }

    // constructor
    var LinkMaker = Ipsuite.LinkMaker = function(document) {

        if (document) {
            this.document = document;
            this.country = document['@country'];
            this.docnumber = document['@doc-number'];
            this.kind = document['@kind'];
            this.fullnumber = this.country + this.docnumber + this.kind;
        }

        Object.defineProperty(this, 'document_number', {
            get: function() {
                return this.document.get_document_number();
            }
        });

    };

    // implementation
    _.extend(LinkMaker.prototype, {

        drawing_url: function() {
            // http://ops.epo.org/3.1/rest-services/published-data/images/EP/1000000/PA/firstpage.png?Range=1
            // http://ops.epo.org/3.1/rest-services/published-data/images/US/20130311929/A1/thumbnail.tiff?Range=1
            var url_tpl = _.template('/api/drawing/<%= document_number %>');
            var url = url_tpl({document_number: this.document_number});
            //var url = url_tpl({document_number: 'abc'});
            return url;
        },

        fullimage_url: function() {
            // http://ops.epo.org/3.1/rest-services/published-data/images/EP/1000000/A1/fullimage.pdf?Range=1
            var url_tpl = _.template('/api/ops/<%= patent_number %>/image/full');
            var url = url_tpl({patent_number: this.get_patent_number()});
            return url;
        },

        universal_pdf_url: function(document_id) {
            // /api/pdf/EP0666666B1
            if (!document_id) {
                var url_tpl = _.template('/api/pdf/<%= fullnumber %>');
                var url = url_tpl(this);
            } else {
                var url_tpl = _.template('/api/pdf/<%= document_id %>');
                var url = url_tpl({document_id: document_id});
            }
            return url;
        },

        ops_pdf_url: function() {
            // /api/ops/EP0666666B1/pdf/all
            var url_tpl = _.template('/api/ops/<%= fullnumber %>/pdf/all');
            var url = url_tpl(this);
            return url;
        },

        espacenet_pdf_url: function() {
            // http://worldwide.espacenet.com/espacenetDocument.pdf?flavour=trueFull&FT=D&CC=US&NR=6269530B1&KC=B1
            var url_tpl = _.template('http://worldwide.espacenet.com/espacenetDocument.pdf?flavour=trueFull&FT=D&CC=<%= country %>&NR=<%= docnumber %><%= kind %>&KC=<%= kind %>');
            var url = url_tpl(this);
            return url;
        },

        depatisnet_pdf_url: function() {
            // https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=AU002005309058B2
            var url_tpl = _.template('https://depatisnet.dpma.de/DepatisNet/depatisnet?action=pdf&docid=<%= fullnumber %>');
            var url = url_tpl(this);
            return url;
        },


        epo_register_url: function() {
            // https://register.epo.org/application?number=EP95480005
            var document_id = this.document.get_application_reference('docdb');
            var url_tpl = _.template('https://register.epo.org/application?number=<%= country %><%= docnumber %>');
            var url = url_tpl(document_id);
            return url;
        },

        inpadoc_legal_url: function() {
            // http://worldwide.espacenet.com/publicationDetails/inpadoc?CC=US&NR=6269530B1&KC=B1&FT=D
            var url_tpl = _.template('http://worldwide.espacenet.com/publicationDetails/inpadoc?FT=D&CC=<%= country %>&NR=<%= docnumber %><%= kind %>&KC=<%= kind %>');
            var url = url_tpl(this);
            return url;
        },

        dpma_register_url: function() {

            // TODO: use only for DE- and WO-documents

            // DE19630877.1 / DE19630877A1 / DE000019630877C2
            // http://localhost:6543/ops/browser?query=pn=DE19630877A1
            // http://localhost:6543/jump/dpma/register?pn=DE19630877
            // https://register.dpma.de/DPMAregister/pat/register?AKZ=196308771

            // DE102012009645.3 / DE102012009645A1
            // http://localhost:6543/ops/browser?query=pn=DE102012009645
            // http://localhost:6543/jump/dpma/register?pn=DE102012009645
            // https://register.dpma.de/DPMAregister/pat/register?AKZ=1020120096453

            // 1. DE102012009645 works
            //    -            DE102012009645A1: no
            //    - [docdb]    DE102012009645A: no
            //    - [epodoc]   DE20121009645: no
            //    - [original] 102012009645: no
            //    => use docdb format, but without kindcode
            //
            // 2. 102012009645 finds WO document 2012009645
            //    works as well: WO2012009645

            // 3. PCT/US2011/044199 does not work yet, why/how?

            var document_id = this.document.get_application_reference('docdb');
            var url_tpl = _.template('/office/dpma/register/application/<%= country %><%= docnumber %>?redirect=true');
            var url = url_tpl(document_id);
            return url;
        },

        uspto_appft_biblio: function() {
            // http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PG01&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.html&r=1&f=G&l=50&s1=20160105912
            var url_tpl = _.template('http://appft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PG01&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.html&r=1&f=G&l=50&s1=<%= docnumber %>');
            var url = url_tpl(this);
            return url;
        },

        uspto_appft_images: function() {
            // http://pdfaiw.uspto.gov/.aiw?docid=20160105912
            var url_tpl = _.template('http://pdfaiw.uspto.gov/.aiw?docid=<%= docnumber %>');
            var url = url_tpl(this);
            return url;
        },

        uspto_patft_biblio: function() {
            // http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=9317610
            var url_tpl = _.template('http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO1&Sect2=HITOFF&d=PALL&p=1&u=%2Fnetahtml%2FPTO%2Fsrchnum.htm&r=1&f=G&l=50&s1=<%= docnumber %>');
            var url = url_tpl(this);
            return url;
        },

        uspto_patft_images: function() {
            // http://pdfpiw.uspto.gov/.piw?docid=9317610
            var url_tpl = _.template('http://pdfpiw.uspto.gov/.piw?docid=<%= docnumber %>');
            var url = url_tpl(this);
            return url;
        },


        uspto_pair_url: function() {
            // http://portal.uspto.gov/pair/PublicPair
            var url_tpl = _.template('http://portal.uspto.gov/pair/PublicPair');
            var url = url_tpl(this);
            return url;
        },

        inpadoc_family_url: function() {
            // http://worldwide.espacenet.com/publicationDetails/inpadocPatentFamily?CC=US&NR=6269530B1&KC=B1&FT=D
            var url_tpl = _.template('http://worldwide.espacenet.com/publicationDetails/inpadocPatentFamily?FT=D&CC=<%= country %>&NR=<%= docnumber %><%= kind %>&KC=<%= kind %>');
            var url = url_tpl(this);
            return url;
        },

        ops_family_url: function() {
            // http://ops.epo.org/3.0/rest-services/family/publication/docdb/EP.2070806.B1/biblio,legal
            var url_tpl = _.template('http://ops.epo.org/3.1/rest-services/family/publication/docdb/<%= country %>.<%= docnumber %>.<%= kind %>/biblio,legal');
            var url = url_tpl(this);
            return url;
        },

        ccd_viewer_url: function() {
            // http://ccd.fiveipoffices.org/CCD-2.0/html/viewCcd.html?num=CH20130000292&type=application&format=epodoc
            // http://ccd.fiveipoffices.org/CCD-2.0/html/viewCcd.html?num=DE20132003344U&type=application&format=epodoc
            // http://ccd.fiveipoffices.org/CCD-2.0/html/viewCcd.html?num=US201113881490&type=application&format=epodoc
            var document_id = this.document.get_application_reference('epodoc');
            var url_tpl = _.template('http://ccd.fiveipoffices.org/CCD-2.0.8/html/viewCcd.html?num=<%= fullnumber %>&type=application&format=epodoc');
            var url = url_tpl(document_id);
            return url;
        },

        depatisnet_url: function() {
            // https://depatisnet.dpma.de/DepatisNet/depatisnet?action=bibdat&docid=DE000004446098C2
            // https://depatisnet.dpma.de/DepatisNet/depatisnet?action=bibdat&docid=EP0666666A2
            // https://depatisnet.dpma.de/DepatisNet/depatisnet?action=bibdat&docid=EP666666A2
            var document_id = this.document.get_publication_reference('docdb');
            var url_tpl = _.template('https://depatisnet.dpma.de/DepatisNet/depatisnet?action=bibdat&docid=<%= fullnumber %>');
            var url = url_tpl(document_id);
            return url;
        },

        espacenet_worldwide_url: function() {
            // http://worldwide.espacenet.com/publicationDetails/biblio?DB=worldwide.espacenet.com&FT=D&CC=US&NR=2014140267A1&KC=A1
            var document_id = this.document.get_publication_reference('docdb');
            var url_tpl = _.template('http://worldwide.espacenet.com/publicationDetails/biblio?CC=<%= country %>&NR=<%= docnumber %>&KC=<%= kind %>');
            var url = url_tpl(document_id);
            return url;
        },

        google_url: function() {
            // https://www.google.com/patents/EP0666666B1
            var document_id = this.document.get_publication_reference('docdb');
            var url_tpl = _.template('https://www.google.com/patents/<%= country %><%= docnumber %>');
            var url = url_tpl(document_id);
            return url;
        },

        google_prior_art_url: function() {
            // https://www.google.com/patents/related/EP0666666B1
            var document_id = this.document.get_publication_reference('docdb');
            var url_tpl = _.template('https://www.google.com/patents/related/<%= fullnumber %>');
            var url = url_tpl(document_id);
            return url;
        },

        cipo_biblio: function() {
            // http://brevets-patents.ic.gc.ca/opic-cipo/cpd/eng/patent/2702893/summary.html
            var url_tpl = _.template('http://brevets-patents.ic.gc.ca/opic-cipo/cpd/eng/patent/<%= docnumber %>/summary.html');
            var url = url_tpl(this);
            return url;
        },

        /*
        query_link: function(label, value, attribute) {
            var link_tpl = _.template('<a class="query-link" href="" data-query-attribute="<%= attribute %>" data-query-value="<%= value %>"><%= label %></a>');
            var link = link_tpl({attribute: attribute, value: value, label: label});
            return link;
        },
        */

    });

}).call(this);
