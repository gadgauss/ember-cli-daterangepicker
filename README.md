# This fork

this fork was made for localising the datepicker so if you are not using ember-i18n this will deffinitely not work for you and even if you are, you would have to add the strings to your locales files

# Ember CLI daterangepicker

Just a simple component to use [bootstrap-daterangepicker](https://github.com/dangrossman/bootstrap-daterangepicker).

## Installation

Install [bootstrap-daterangepicker](https://github.com/dangrossman/bootstrap-daterangepicker) and [ember-moment](https://github.com/stefanpenner/ember-moment), they are dependencies.

* `ember install:addon ember-cli-daterangepicker`

## Usage

```handlebars
{{date-range-picker label='Creation Date' start=betweenCreatedAtStartsAt end=betweenCreatedAtEndsAt}}
```

## Running Tests

* `ember test`
* `ember test --server`

## Contributing

1. [Fork it](https://github.com/josemarluedke/ember-cli-daterangepicker/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request


# License

Copyright (c) 2015 Josemar Luedke

Licensed under the [MIT license](LICENSE.md).