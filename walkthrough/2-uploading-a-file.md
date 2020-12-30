# Uploading a specification

![T3 Innovation Network Logo](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273002/t3-desm/T3Logo_lv3xpn.png)

In order to begin mapping a specification, different steps are involved.

The user can start by pressing the "Map a Specification" button at the top navigation bar (or the one that says "Start Mapping").

![Start Mapping](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609280546/t3-desm/start-mapping-button_ltprqz.png)

## The specification form
A few data is asked about the specification to be uploaded. First, a name, a version and use case (both not mandatory), and a domain.

### The available domains

![Available domains](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609281046/t3-desm/available-domains_qy5bf3.png)

The list of domains to be selected, depends on the [skos](https://www.w3.org/TR/skos-reference/) file placed on the `concepts` directory with the name ending on `...abstractClasses.json`. By default, the tool provides a file called `desmAbstractClasses.json` with the domains as listed in the image above.

### Uploading a file

The tool supports RDF, JSON, XML or JSONLD formats. The user can either upload a single file or multiple at once. Each time the `browse` button is clicked, the already attached files are replaced by the new ones.

Once the files are selected, the user can preview the details to validate these are the intended ones:

![File information previews](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609281465/t3-desm/file-previews_tvvmwd.png)

### Processing the file (part 1)

A rounded orange button with a right arrow appears to lead the user to process the file. Once the button is clicked, the tool will perform a few processes in order to find out if there are more than one only [rdfs:Class](https://www.w3.org/TR/rdf-schema/#ch_class) in the selected file/s. If it's so, it will prompt to select one or more of these classes.

![Filter domains found in file](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609281806/t3-desm/filter-domains-in-file_j3dzqx.png)

It may be the case only 1 domain was found in the file/s. In that case, the next step will be directly performed.

### Processing the file (part 2)

The tool then will perform the filtering of the original detected properties and classes found in the uploaded file/s to generate a preview with only those properties that are related to the classes the user selected.

Then a preview will appear to let the user approve or re-import if necessary. This is a previous step to actually store the specification to the tool's records.

![Preview specification](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609282369/t3-desm/preview-specification_zmln9f.gif)

In the image above there's a second tab with a Vocabulary. That's because a file may contain concepts alongside with the classes and properties of the graph, and the tool will also recognize it and put it in the correct concept scheme to organize it and let the user choice whether to keep or discard it.

### Upload a vocabulary

If some vocabulary information is missing and it's necessary to upload a separated file, or fetch it by URL, it can be achieved by pressing the label `Add Vocabulary`.

![Upload a Vocabulary](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609270825/t3-desm/add-vocabulary_p6ggjx.png)


## And that's it!

Now the tool will process the file to create the specification. If the specification is the first to be linked to the selected domain (See [The available domains](#the-available-domains)) it will be marked as **the spine** for that domain, so forward specifications will map to it. This is how the recent uploaded spine specification would look like:

![Spine uploaded](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609270825/t3-desm/spine-uploaded_u0ve9a.png)

> Continue reading ...
- [Previous - Welcome to the tool](https://github.com/t3-innovation-network/desm/tree/master/walkthrough/1-welcome-to-the-tool.md)
- [Next - Selecting properties](https://github.com/t3-innovation-network/desm/tree/master/walkthrough/3-selecting-properties.md)
- [Back to the main Readme file](https://github.com/t3-innovation-network/desm)
