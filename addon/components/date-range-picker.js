import Ember from 'ember';

/**
 * Component for handle with bootstrap-daterangepicker
 * @author Martin Adamec (adamec@cognito.cz)
 */
export default Ember.Component.extend({
    // class names for container
    classNames: ['form-group'],
    // Container bindings attr
    attributeBindings: ['start', 'end', 'serverFormat'],

    // Start and end of date range
    start: undefined,
    end: undefined,

    // The earliest/latest date a user may select
    minDate: undefined,
    maxDate: undefined,
    
    // Show week numbers at the start of each week on the calendars
    showWeekNumbers: false,

    // Show year and month select boxes above calendars to jump to a specific month and year
    showDropdowns: true,

    // When enabled, the two calendars displayed will always be for two sequential months,
    // When disabled, the two calendars can be individually advanced and display any month/year.
    linkedCalendars: false,

    // Default date format
    format: moment.localeData().longDateFormat("LL"),

    // Date format for transferring
    serverFormat: 'YYYY-MM-DD',

    // Whether the picker appears aligned to the left, to the right, or centered under the HTML element it's attached to
    // left/right/center
    opens: "center",

    // Whether the picker appears below (default) or above the HTML element it's attached to
    // down/up
    drops: null,

    // Seprator for date range
    separator: ' - ',

    // Mask for output
    mask: "from {0} to {1}",

    // Show only a single calendar to choose one date, instead of a range picker with two calendars; 
    // the start and end dates provided to your callback will be the same single date chosen
    singleDatePicker: false,

    // -- Buttons --
    // CSS class names that will be added to all buttons in the picker
    buttonClasses: ['btn'],
    // CSS class string that will be added to the apply button
    applyClass: null,
    // CSS class string that will be added to the cancel button
    cancelClass: null,

    /**
     * Format text for output
     */
    rangeText: Ember.computed('start', 'end', function(){
        var format = this.get('format'),
            serverFormat = this.get('serverFormat'),
            start = this.get('start'),
            end = this.get('end'),
            mask = this.get("mask");

        if ( !Ember.isEmpty(start) && !Ember.isEmpty(end) ) {
            return mask.replace("{0}", moment(start, serverFormat).format(format)).replace("{1}", moment(end, serverFormat).format(format));
        }
        return '';
    }),

    // Default ranges
    ranges: [
        "today",
        "yesterday",
        "last-7",
        "last-week",
        "month-this",
        "month-last",
        "year-this"
    ],

    // If modul should be remove on destroy
    removeDropdownOnDestroy: false,

    // Callback function after select range
    applyAction: null,

    // Callback function after cancel selected range
    cancelAction: null,

    // Indicates whether the date range picker should automatically update the value
    autoUpdateInput: false,

    // If selected range should be apply after selected end date in custom range
    autoApply: false,

    // Templates for some parts of picker
    templates: {
        arrowLeft: '<i class="cico cico-arrow-left"></i>',
        arrowRight: '<i class="cico cico-arrow-right"></i>',
    },

    // Date locale options
    locale: {
    },


    /**
     * Init of datepicker
     * @return {[type]} [description]
     */
    datepickerInit: function()
    {
        if ( !this.get('start') || !this.get('end') )
        {
            return;
        }
        var self = this;
        var momentStartDate = moment(this.get('start'), this.get('serverFormat')),
            momentEndDate = moment(this.get('end'), this.get('serverFormat')),
            startDate = momentStartDate.isValid() ? momentStartDate : undefined,
            endDate = momentEndDate.isValid() ? momentEndDate : undefined,
            momentMinDate = moment(this.get('minDate'), this.get('serverFormat')),
            momentMaxDate = moment(this.get('maxDate'), this.get('serverFormat')),
            minDate = momentMinDate.isValid() ? momentMinDate : undefined,
            maxDate = momentMaxDate.isValid() ? momentMaxDate : undefined;

        // Set options
        var options = {
            autoUpdateInput: this.get('autoUpdateInput'),
            autoApply: this.get('autoApply'),
            locale: $.extend({
                    cancelLabel: 'Cancel',
                    separator: this.get("separator"),
                    format: this.get('format'),
                    firstDay: moment.localeData().firstDayOfWeek(),
                }, this.get("locale")),
            startDate: startDate,
            endDate: endDate,
            minDate: minDate,
            maxDate: maxDate,
            timePicker: this.get('timePicker'),
            buttonClasses: this.get('buttonClasses'),
            applyClass: this.get('applyClass'),
            cancelClass: this.get('cancelClass'),
            separator: this.get('separator'),
            singleDatePicker: this.get('singleDatePicker'),
            drops: this.get('drops'),
            opens: this.get('opens'),
            timePicker24Hour: this.get('timePicker24Hour'),
            timePickerSeconds: this.get('timePickerSeconds'),
            timePickerIncrement: this.get('timePickerIncrement'),
            showWeekNumbers: this.get('showWeekNumbers'),
            showDropdowns: this.get('showDropdowns'),
            linkedCalendars: this.get('linkedCalendars'),
            templates: this.get("templates")
        };

        // If single => not ranges
        if ( !this.get('singleDatePicker') ) {
            options.ranges = this.get('dateRanges');
        }

        // Init daterange
        this.$('.daterangepicker-input').daterangepicker(options);

        // Apply
        this.$('.daterangepicker-input').on('apply.daterangepicker', function(ev, picker) {
            var start = picker.startDate.format(self.get('serverFormat')),
                end = picker.endDate.format(self.get('serverFormat')),
                applyAction = self.get('applyAction');

            if (applyAction) {
                Ember.assert(
                    'applyAction for date-range-picker must be a function',
                    typeof applyAction === 'function'
                );
                applyAction(start, end);
            } 
            else {
                self.setProperties({
                    start, end
                });
            }
        });

        // Cancel
        this.$('.daterangepicker-input').on('cancel.daterangepicker', function() {
            var cancelAction = self.get('cancelAction');

            if (cancelAction) {
                Ember.assert(
                    'cancelAction for date-range-picker must be a function',
                    typeof cancelAction === 'function'
                );
                cancelAction();
            } 
            else {
                self.set('start', self.get('start'));
                self.set('end', self.get('end'));
            }
        });

    }.observes("start", "end"),


    /**
     * Init the dropdown when the component is added to the DOM
     */
    didInsertElement: function() {
        this.datepickerInit();
    },

    //Remove the hidden dropdown when this component is destroyed
    willDestroy: function() {
        if (this.get('removeDropdownOnDestroy')) {
            Ember.$('.daterangepicker').remove();
        }
    },


    /**
     * Create date ranges
     */
    dateRanges: function(){
        var ranges = this.get("ranges"),
            r = {};

        for ( var i = 0; i < ranges.length; i++ )
        {
            switch ( ranges[i] ) {
                case "today":
                    r["Today"] = [moment(), moment()];
                    break;
                case "yesterday":
                    r["Yesterday"] = [moment().subtract(1, 'days'), moment().subtract(1, 'days')];
                    break;
                case "last-7":
                    r["Last 7 Days"] = [moment().subtract(6, 'days'), moment()];
                    break;
                case "last-week":
                    r["Last week (Mo-Su)"] = [moment().subtract(1, 'week').startOf("week"), moment().subtract(1, 'week').endOf("week")];
                    break;
                case "month-this":
                    r["Month to Date"] = [moment().startOf("month"), moment()];
                    break;
                case "month-last":
                    r["Previous Month"] = [moment().subtract(1, 'month').startOf("month"), moment().subtract(1, 'month').endOf("month")];
                    break;
                case "year-this":
                    r["Year to Date"] = [moment().startOf("year"), moment()];
                    break;
                default:
                    Ember.Logger.error("Daterange picker range '" + ranges[i] + "' are not set.");
                    throw new Error("Daterange picker range '" + ranges[i] + "' are not set.");
            }
        }
        return r;
    }.property("ranges"),
});
