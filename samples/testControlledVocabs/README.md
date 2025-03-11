This folder has samples for testing the import of Controlled Vocabularies

See issue #587

The files:

Small stand-alone controlled vocabs:
* lrmi-educationalUse.ttl A simple, small SKOS Concept scheme in turtle
* lrmi-educationalUse-raw.json The same SKOS Concpet Scheme in JSON-LD, with no context just URIs and ojects.
* lrmi-educationalUse-df.json The same but with a context block to make the JSON more paletable.
* ceds-educationalUse.csv A similar vocabulary as a CSV.
* simpleEnum.xsd A simple XML Schema enumeration.
* StateProvinceElement.xsd A largish controlled vocabulary from PESC as an XSD enumeration.
* color-enum+meta.json A JSON-Schema enumeration with meta:enum providing the term definitions.
* color-AnyOf.json A JSON-Schema controlled vocabulary with anyOf keyword.
* color-OneOf.json A JSON-Schema controlled vocabulary with oneOf keyword.


Other larger schemas which include Controlled Vocabs in the main schema:
* CTDL, get it fresh from [here](https://credreg.net/ctdl/schema/encoding/json?includemetaproperties=false)
* CEDS stable copy here: https://docs.google.com/spreadsheets/d/1AqkcEtIuUQOoRehGQKqBeehIV5WKMdqJgGV0flVGQBc/edit?usp=drive_link
  * note, this uses a single cell for what CEDS calls the Option Set formatted as `code`-`label` (no definition).
  * This is probably the file that was used to develop the current import.
* PESC College Transcript, available from https://pesc.org/college-transcript/ has many.