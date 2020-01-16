import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { Chart } from 'angular-highcharts';
import { FormGroup, FormBuilder } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment';

import { FundsService } from 'src/app/services';

@Component({
    selector: 'app-funds-details',
    templateUrl: './funds-details.component.html',
    styles: []
})

export class FundsDetailsComponent implements OnInit, OnDestroy {

    // Fund Variables
    funds: any = [];
    fundDetails: any = [];

    // Routing Vairables
    fundID: any;
    fundSubscribe: any;

    // Chart Variables
    chart: Chart;
    chartOptions: any;
    chartData: any;

    // Datepicker Variables
    datepickerConfig: Partial<BsDatepickerConfig>;
    minDate: Date;
    maxDate: Date;

    // Form Variables
    filterForm: FormGroup;
    fromDate: Date;
    toDate: Date;
    formValid: boolean = false;
    error: any;
    loading: boolean = false;
    submitted: boolean = false;

    constructor(
        private AR: ActivatedRoute,
        private FS: FundsService,
        private router: Router,
        private FB: FormBuilder,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Get fund id from route
        this.fundSubscribe = this.AR.paramMap.subscribe(params => {
            this.fundID = params.get('fund_id');
        });
    }

    /**
     * Easy access of form controls
     */
    get f() {
        return this.filterForm.controls;
    }

    /**
     * Redirect to home route
     */
    redirect() {
        this.router.navigate(['/']);
    }

    /**
     * Returns YYYY-MM-DD date format if not empty
     * @param date : string
     */
    convertToDate(date: any) {
        if (date == null) return '';
        return moment(date).format('YYYY-MM-DD');
    }

    /* ====================*/
    /*  Funds Dropdown Functions */
    /* ====================*/

    /**
     * Loads all funds list into dropdown
     */
    loadFundsList() {
        this.FS.getFundList()
            .subscribe(
                res => {
                    if (res) {
                        this.funds = res;
                        return;
                    }
                    this.redirect();
                },
                () => {
                    this.redirect();
                }
            );
    }

    /**
     * Route on Dropdown value change and load related fund data
     * @param value :any 
     */
    onFundDropDownChange(value: any) {
        this.router.navigate(['/details', value]);
        this.filterForm.reset();
        this.fundID = value;
        this.loadFundDetails();
    }
    //Ends here

    /* ============*/
    /*  Chart Functions */
    /* ============*/

    /**
     * Sets chart config options
     */
    setChartOptions() {
        this.chartOptions = {
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            title: {
                text: '',
                style: {
                    color: "#FFFFFF",
                }
            },
            subtitle: {
                text: ''
            },
            chart: {
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                backgroundColor: "#0061a0",
            },
            xAxis: {
                ordinal: false,
                type: 'datetime',
                dateTimeLabelFormats: {
                    day: '%e %b, %y',
                    week: '%b %e',
                    month: '%b %Y',
                    year: '%Y'
                },
                labels: {
                    style: {
                        color: '#FFFFFF'
                    }
                },
                gridLineColor: 'rgba(255,255,255,0.2)',
                lineColor: 'rgba(255,255,255,0.2)',
                minorGridLineColor: 'rgba(255,255,255,0.2)',
                tickColor: 'rgba(255,255,255,0.2)',
            },
            yAxis: {
                title: {
                    text: null,
                },
                labels: {
                    style: {
                        color: '#FFFFFF'
                    }
                },
                gridLineColor: 'rgba(255,255,255,0.2)',
                lineColor: 'rgba(255,255,255,0.2)',
                minorGridLineColor: 'rgba(255,255,255,0.2)',
                tickColor: 'rgba(255,255,255,0.2)',
            },
            tooltip: {
                // xDateFormat: '%a, %e %b %Y'
                formatter: function() {
                    var date = moment(this.key).format("ddd, DD MMM YYYY");
                    var price = this.y.toFixed(4);
                    return date+"<br/>"+this.series.name+": "+price;
                }
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, "rgba(255, 255, 255, 0.2)"],
                            [1, "rgba(255, 255, 255, 0)"]
                        ]
                    },
                    marker: {
                        enabled: true,
                        radius: 2,
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 2,
                                lineColor: "#FFFFFF",
                                fillColor: '#FF0000',
                            }
                        }
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: 'Unit Price',
                data: this.chartData,
                color: "#FFFFFF",
            }]
        };
    }

    /**
     * Initilize chart
     */
    initChart() {
        let chart = new Chart(this.chartOptions);
        this.chart = chart;
    }
    //Ends here

    /* ================*/
    /*  Datepicker Functions  */
    /* ================*/

    /**
     * Sets datepicker config options
     */
    setDatesConfig() {
        this.datepickerConfig = Object.assign({},
            {
                containerClass: 'theme-dark-blue datepicker-container-wrap',
                showWeekNumbers: false,
                dateInputFormat: 'DD MMM YYYY',
                isAnimated: true,
                adaptivePosition: true,
                minDate: this.minDate,
                maxDate: this.maxDate,
            }
        );
    }
    //Ends here

    /* ================*/
    /*  Filter Form Functions  */
    /* ================*/

    /**
     * Validates filter form
     */
    validateFilter() {
        this.filterForm.valueChanges.subscribe(change => {
            this.formValid = false;
            this.error = false;
            var from = change.from;
            var to = change.to;
            if (from != null && to != null) {
                if (moment(to).diff(moment(from)) < 0) {
                    this.f.to.setValue(null);
                    this.error = false;
                    this.error = "To date cannot be greater than From date.";
                    this.formValid = false;
                } else {
                    this.formValid = true;
                    this.error = false;
                }
            } else if (from != null && to == null) {
                this.formValid = true;
                this.error = false;
            } else if (from == null && to != null) {
                this.formValid = true;
                this.error = false;
            }
        });

    }

    /**
     * Filter submit callback function
     */
    onFilterSubmit() {
        // stop here if form is invalid
        if (!this.formValid) {
            this.submitted = false;
            return;
        }

        var formData = {
            'fund_id': this.fundID,
            'from': this.convertToDate(this.f.from.value),
            'to': this.convertToDate(this.f.to.value)
        };

        // Start loading && enable submitted
        this.submitted = true;
        this.loading = true;
        this.FS.getChartData(formData)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.submitted = false;
                })
            )
            .subscribe(
                res => {
                    this.chartData = res;
                    this.chart = null;
                    // Set chart config options
                    this.setChartOptions();
                    // Initialize chart
                    this.initChart();
                },
                err => {
                    console.log(err);
                }
            );
    }
    //Ends here

    /* ================*/
    /*  Fund Details Function */
    /* ================*/

    /**
     * Loads fund details
     */
    loadFundDetails() {
        this.FS.getFundDetails(this.fundID)
            .subscribe(
                res => {
                    if (res) {
                        this.fundDetails = res;
                        if (this.fundDetails.min_date != null) {
                            this.minDate = new Date(this.fundDetails.min_date);
                        }
                        if (this.fundDetails.max_date != null) {
                            this.maxDate = new Date(this.fundDetails.max_date);
                        }
                        
                        this.chartData = this.fundDetails.map;
                        // Set chart config options
                        this.setChartOptions();
                        // Initialize chart
                        this.initChart();
                        // Set date picker config
                        this.setDatesConfig();
                    } else {
                        this.redirect();
                    }
                },
                error => {
                    this.redirect();
                }
            );
    }
    //Ends here

    /**
     * Initialize component callback
     */
    ngOnInit() {
        this.filterForm = this.FB.group({
            from: null,
            to: null
        });

        this.loadFundDetails();
        this.loadFundsList();

        this.validateFilter();
    }

    /**
     * Destroy component callback
     */
    ngOnDestroy() {
        this.fundSubscribe.unsubscribe();
        this.fundDetails = null;
        this.chart = null;
    }
}
