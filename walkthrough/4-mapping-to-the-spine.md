# Mapping to the spine

![T3 Innovation Network Logo](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609273002/t3-desm/T3Logo_lv3xpn.png)

Here the tool presents a screen with information about both the properties of the spine specification and the selected properties from the specification the user uploaded.

This will allow the user to being mapping properties against the spine.

![Mapping a property](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609270825/t3-desm/mapping-a-property_yrsjbt.png)

## Click to select a property

The same way as in the `Mapping to Domains` screen, the user can click into a property card to select it and it will show its borders to indicate it's ready to be dragged.

## Drag the properties to a spine property

For each spine term, now there's a row with three cards. The first one with information about the spine property, the second, with information about the predicates, and the last one, with a drop zone, available to receive property card/s.

The user can select one or more properties from the list in the right side of the screen, and drop into one of these drop zones to indicate that the selected property is going to be mapped against the spine term in the same row as the drop zone in which the property was dropped.

![Dragging a property](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609286420/t3-desm/dragging-a-property_zmygdg.png)

## The available predicates

The list of predicates being shown when the user clicks on the card in the center depends entirely on the [skos](https://www.w3.org/TR/skos-reference/) file placed in the `concepts` directory with the name ending in `...predicates.json`.

The tool provides by default a file which makes a set of predicates to let the use work with. This file is called `desmMappingPredicates.json`.

![Predicates list](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609286117/t3-desm/predicates-list_atf5vx.png)

## Add a comment to an alignment

The user can add a comment to an alignment by clicking on the comment button. It will open a modal window to allow the user add a text which will be saved against the alignment.

## Save the changes

The user can always click on `Save Changes` and continue mapping in a different moment, and also with a different device.

## Done mapping

Once the user is confident with the mapping work, the mapping can be marked as `Mapped` by clicking on the `Done Mapping` button.

## Specifications List

The user will be redirected to the list of specifications uploaded by the user itself and/or (depending on the filter) the ones belonging to the same organization.

![Specifications List](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609270826/t3-desm/specifications-list_ry5m5x.png)

## Changelog

If the mapping is marked as `Mapped`, it still can be edited, and the changes since then will appear in a changelog blue box at the top of the properties list.

![Changelog](https://res.cloudinary.com/ricardo-gamarra/image/upload/v1609287113/t3-desm/changelog_bspwvi.gif)

## And that's it!

Now mapping properties will appear in the mapping properties list, to be explained in the next section.

> Continue reading ...
- [Previous - Selecting properties](https://github.com/t3-innovation-network/desm/tree/master/walkthrough/3-selecting-properties.md)
- [Next - Viewing the mappings](https://github.com/t3-innovation-network/desm/tree/master/walkthrough/5-viewing-the-mappings.md)
- [Back to the main Readme file](https://github.com/t3-innovation-network/desm)