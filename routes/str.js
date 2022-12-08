var express = require('express');
var router = express.Router();

const db = require('../services/mysqldb');
const config = require('../config');

const _ = require('lodash');
const util = require('../services/cmn-util')

var date = new Date();

// ---- Hard code requested columns for efficiency
// Benchmarking show about a 50% increase in speed requesting a slice from a row in the DB vs all (*)
var str_select = {}
str_select['volts'] = []
str_select['temperature'] = []
str_select['impedance'] = []
str_select['balance'] = []

str_select['volts'][0] = "vTray1_01,vTray1_02,vTray1_03,vTray1_04,vTray1_05,vTray1_06,vTray1_07,vTray1_08,vTray1_09,vTray1_10,vTray1_11,vTray1_12,vTray1_13,vTray1_14,vTray1_15,vTray1_16,vTray1_17,vTray1_18,vTray1_19,vTray1_20,vTray1_21,vTray1_22,vTray1_23,vTray1_24,vTray1_25,vTray1_26,vTray1_27,vTray1_28,vTray1_29,vTray1_30,vTray1_31,vTray1_32,vTray1_33,vTray1_34,vTray1_35,vTray1_36,vTray1_37,vTray1_38,vTray1_39,vTray1_40,vTray1_41,vTray1_42,vTray1_43,vTray1_44,vTray1_45,vTray1_46,vTray1_47,vTray1_48,vTray1_49,vTray1_50,vTray1_51,vTray1_52,vTray1_53,vTray1_54,vTray1_55,vTray1_56,vTray1_57,vTray1_58,vTray1_59,vTray1_60,vTray1_61,vTray1_62,vTray1_63,vTray1_64,vTray1_65,vTray1_66,vTray1_67,vTray1_68,vTray1_69,vTray1_70"
str_select['volts'][1] = "vTray2_01,vTray2_02,vTray2_03,vTray2_04,vTray2_05,vTray2_06,vTray2_07,vTray2_08,vTray2_09,vTray2_10,vTray2_11,vTray2_12,vTray2_13,vTray2_14,vTray2_15,vTray2_16,vTray2_17,vTray2_18,vTray2_19,vTray2_20,vTray2_21,vTray2_22,vTray2_23,vTray2_24,vTray2_25,vTray2_26,vTray2_27,vTray2_28,vTray2_29,vTray2_30,vTray2_31,vTray2_32,vTray2_33,vTray2_34,vTray2_35,vTray2_36,vTray2_37,vTray2_38,vTray2_39,vTray2_40,vTray2_41,vTray2_42,vTray2_43,vTray2_44,vTray2_45,vTray2_46,vTray2_47,vTray2_48,vTray2_49,vTray2_50,vTray2_51,vTray2_52,vTray2_53,vTray2_54,vTray2_55,vTray2_56,vTray2_57,vTray2_58,vTray2_59,vTray2_60,vTray2_61,vTray2_62,vTray2_63,vTray2_64,vTray2_65,vTray2_66,vTray2_67,vTray2_68,vTray2_69,vTray2_70"
str_select['volts'][2] = "vTray3_01,vTray3_02,vTray3_03,vTray3_04,vTray3_05,vTray3_06,vTray3_07,vTray3_08,vTray3_09,vTray3_10,vTray3_11,vTray3_12,vTray3_13,vTray3_14,vTray3_15,vTray3_16,vTray3_17,vTray3_18,vTray3_19,vTray3_20,vTray3_21,vTray3_22,vTray3_23,vTray3_24,vTray3_25,vTray3_26,vTray3_27,vTray3_28,vTray3_29,vTray3_30,vTray3_31,vTray3_32,vTray3_33,vTray3_34,vTray3_35,vTray3_36,vTray3_37,vTray3_38,vTray3_39,vTray3_40,vTray3_41,vTray3_42,vTray3_43,vTray3_44,vTray3_45,vTray3_46,vTray3_47,vTray3_48,vTray3_49,vTray3_50,vTray3_51,vTray3_52,vTray3_53,vTray3_54,vTray3_55,vTray3_56,vTray3_57,vTray3_58,vTray3_59,vTray3_60,vTray3_61,vTray3_62,vTray3_63,vTray3_64,vTray3_65,vTray3_66,vTray3_67,vTray3_68,vTray3_69,vTray3_70"
str_select['volts'][3] = "vTray4_01,vTray4_02,vTray4_03,vTray4_04,vTray4_05,vTray4_06,vTray4_07,vTray4_08,vTray4_09,vTray4_10,vTray4_11,vTray4_12,vTray4_13,vTray4_14,vTray4_15,vTray4_16,vTray4_17,vTray4_18,vTray4_19,vTray4_20,vTray4_21,vTray4_22,vTray4_23,vTray4_24,vTray4_25,vTray4_26,vTray4_27,vTray4_28,vTray4_29,vTray4_30,vTray4_31,vTray4_32,vTray4_33,vTray4_34,vTray4_35,vTray4_36,vTray4_37,vTray4_38,vTray4_39,vTray4_40,vTray4_41,vTray4_42,vTray4_43,vTray4_44,vTray4_45,vTray4_46,vTray4_47,vTray4_48,vTray4_49,vTray4_50,vTray4_51,vTray4_52,vTray4_53,vTray4_54,vTray4_55,vTray4_56,vTray4_57,vTray4_58,vTray4_59,vTray4_60,vTray4_61,vTray4_62,vTray4_63,vTray4_64,vTray4_65,vTray4_66,vTray4_67,vTray4_68,vTray4_69,vTray4_70"

str_select['temperature'][0] = "tTray1_01,tTray1_02,tTray1_03,tTray1_04,tTray1_05,tTray1_06,tTray1_07,tTray1_08,tTray1_09,tTray1_10,tTray1_11,tTray1_12,tTray1_13,tTray1_14,tTray1_15,tTray1_16,tTray1_17,tTray1_18,tTray1_19,tTray1_20,tTray1_21,tTray1_22,tTray1_23,tTray1_24,tTray1_25,tTray1_26,tTray1_27,tTray1_28,tTray1_29,tTray1_30,tTray1_31,tTray1_32,tTray1_33,tTray1_34,tTray1_35,tTray1_36,tTray1_37,tTray1_38,tTray1_39,tTray1_40,tTray1_41,tTray1_42,tTray1_43,tTray1_44,tTray1_45,tTray1_46,tTray1_47,tTray1_48,tTray1_49,tTray1_50,tTray1_51,tTray1_52,tTray1_53,tTray1_54,tTray1_55,tTray1_56,tTray1_57,tTray1_58,tTray1_59,tTray1_60,tTray1_61,tTray1_62,tTray1_63,tTray1_64,tTray1_65,tTray1_66,tTray1_67,tTray1_68,tTray1_69,tTray1_70"
str_select['temperature'][1] = "tTray2_01,tTray2_02,tTray2_03,tTray2_04,tTray2_05,tTray2_06,tTray2_07,tTray2_08,tTray2_09,tTray2_10,tTray2_11,tTray2_12,tTray2_13,tTray2_14,tTray2_15,tTray2_16,tTray2_17,tTray2_18,tTray2_19,tTray2_20,tTray2_21,tTray2_22,tTray2_23,tTray2_24,tTray2_25,tTray2_26,tTray2_27,tTray2_28,tTray2_29,tTray2_30,tTray2_31,tTray2_32,tTray2_33,tTray2_34,tTray2_35,tTray2_36,tTray2_37,tTray2_38,tTray2_39,tTray2_40,tTray2_41,tTray2_42,tTray2_43,tTray2_44,tTray2_45,tTray2_46,tTray2_47,tTray2_48,tTray2_49,tTray2_50,tTray2_51,tTray2_52,tTray2_53,tTray2_54,tTray2_55,tTray2_56,tTray2_57,tTray2_58,tTray2_59,tTray2_60,tTray2_61,tTray2_62,tTray2_63,tTray2_64,tTray2_65,tTray2_66,tTray2_67,tTray2_68,tTray2_69,tTray2_70"
str_select['temperature'][2] = "tTray3_01,tTray3_02,tTray3_03,tTray3_04,tTray3_05,tTray3_06,tTray3_07,tTray3_08,tTray3_09,tTray3_10,tTray3_11,tTray3_12,tTray3_13,tTray3_14,tTray3_15,tTray3_16,tTray3_17,tTray3_18,tTray3_19,tTray3_20,tTray3_21,tTray3_22,tTray3_23,tTray3_24,tTray3_25,tTray3_26,tTray3_27,tTray3_28,tTray3_29,tTray3_30,tTray3_31,tTray3_32,tTray3_33,tTray3_34,tTray3_35,tTray3_36,tTray3_37,tTray3_38,tTray3_39,tTray3_40,tTray3_41,tTray3_42,tTray3_43,tTray3_44,tTray3_45,tTray3_46,tTray3_47,tTray3_48,tTray3_49,tTray3_50,tTray3_51,tTray3_52,tTray3_53,tTray3_54,tTray3_55,tTray3_56,tTray3_57,tTray3_58,tTray3_59,tTray3_60,tTray3_61,tTray3_62,tTray3_63,tTray3_64,tTray3_65,tTray3_66,tTray3_67,tTray3_68,tTray3_69,tTray3_70"
str_select['temperature'][3] = "tTray4_01,tTray4_02,tTray4_03,tTray4_04,tTray4_05,tTray4_06,tTray4_07,tTray4_08,tTray4_09,tTray4_10,tTray4_11,tTray4_12,tTray4_13,tTray4_14,tTray4_15,tTray4_16,tTray4_17,tTray4_18,tTray4_19,tTray4_20,tTray4_21,tTray4_22,tTray4_23,tTray4_24,tTray4_25,tTray4_26,tTray4_27,tTray4_28,tTray4_29,tTray4_30,tTray4_31,tTray4_32,tTray4_33,tTray4_34,tTray4_35,tTray4_36,tTray4_37,tTray4_38,tTray4_39,tTray4_40,tTray4_41,tTray4_42,tTray4_43,tTray4_44,tTray4_45,tTray4_46,tTray4_47,tTray4_48,tTray4_49,tTray4_50,tTray4_51,tTray4_52,tTray4_53,tTray4_54,tTray4_55,tTray4_56,tTray4_57,tTray4_58,tTray4_59,tTray4_60,tTray4_61,tTray4_62,tTray4_63,tTray4_64,tTray4_65,tTray4_66,tTray4_67,tTray4_68,tTray4_69,tTray4_70"

str_select['impedance'][0] = "rTray1_01,rTray1_02,rTray1_03,rTray1_04,rTray1_05,rTray1_06,rTray1_07,rTray1_08,rTray1_09,rTray1_10,rTray1_11,rTray1_12,rTray1_13,rTray1_14,rTray1_15,rTray1_16,rTray1_17,rTray1_18,rTray1_19,rTray1_20,rTray1_21,rTray1_22,rTray1_23,rTray1_24,rTray1_25,rTray1_26,rTray1_27,rTray1_28,rTray1_29,rTray1_30,rTray1_31,rTray1_32,rTray1_33,rTray1_34,rTray1_35,rTray1_36,rTray1_37,rTray1_38,rTray1_39,rTray1_40,rTray1_41,rTray1_42,rTray1_43,rTray1_44,rTray1_45,rTray1_46,rTray1_47,rTray1_48,rTray1_49,rTray1_50,rTray1_51,rTray1_52,rTray1_53,rTray1_54,rTray1_55,rTray1_56,rTray1_57,rTray1_58,rTray1_59,rTray1_60,rTray1_61,rTray1_62,rTray1_63,rTray1_64,rTray1_65,rTray1_66,rTray1_67,rTray1_68,rTray1_69,rTray1_70"
str_select['impedance'][1] = "rTray2_01,rTray2_02,rTray2_03,rTray2_04,rTray2_05,rTray2_06,rTray2_07,rTray2_08,rTray2_09,rTray2_10,rTray2_11,rTray2_12,rTray2_13,rTray2_14,rTray2_15,rTray2_16,rTray2_17,rTray2_18,rTray2_19,rTray2_20,rTray2_21,rTray2_22,rTray2_23,rTray2_24,rTray2_25,rTray2_26,rTray2_27,rTray2_28,rTray2_29,rTray2_30,rTray2_31,rTray2_32,rTray2_33,rTray2_34,rTray2_35,rTray2_36,rTray2_37,rTray2_38,rTray2_39,rTray2_40,rTray2_41,rTray2_42,rTray2_43,rTray2_44,rTray2_45,rTray2_46,rTray2_47,rTray2_48,rTray2_49,rTray2_50,rTray2_51,rTray2_52,rTray2_53,rTray2_54,rTray2_55,rTray2_56,rTray2_57,rTray2_58,rTray2_59,rTray2_60,rTray2_61,rTray2_62,rTray2_63,rTray2_64,rTray2_65,rTray2_66,rTray2_67,rTray2_68,rTray2_69,rTray2_70"
str_select['impedance'][2] = "rTray3_01,rTray3_02,rTray3_03,rTray3_04,rTray3_05,rTray3_06,rTray3_07,rTray3_08,rTray3_09,rTray3_10,rTray3_11,rTray3_12,rTray3_13,rTray3_14,rTray3_15,rTray3_16,rTray3_17,rTray3_18,rTray3_19,rTray3_20,rTray3_21,rTray3_22,rTray3_23,rTray3_24,rTray3_25,rTray3_26,rTray3_27,rTray3_28,rTray3_29,rTray3_30,rTray3_31,rTray3_32,rTray3_33,rTray3_34,rTray3_35,rTray3_36,rTray3_37,rTray3_38,rTray3_39,rTray3_40,rTray3_41,rTray3_42,rTray3_43,rTray3_44,rTray3_45,rTray3_46,rTray3_47,rTray3_48,rTray3_49,rTray3_50,rTray3_51,rTray3_52,rTray3_53,rTray3_54,rTray3_55,rTray3_56,rTray3_57,rTray3_58,rTray3_59,rTray3_60,rTray3_61,rTray3_62,rTray3_63,rTray3_64,rTray3_65,rTray3_66,rTray3_67,rTray3_68,rTray3_69,rTray3_70"
str_select['impedance'][3] = "rTray4_01,rTray4_02,rTray4_03,rTray4_04,rTray4_05,rTray4_06,rTray4_07,rTray4_08,rTray4_09,rTray4_10,rTray4_11,rTray4_12,rTray4_13,rTray4_14,rTray4_15,rTray4_16,rTray4_17,rTray4_18,rTray4_19,rTray4_20,rTray4_21,rTray4_22,rTray4_23,rTray4_24,rTray4_25,rTray4_26,rTray4_27,rTray4_28,rTray4_29,rTray4_30,rTray4_31,rTray4_32,rTray4_33,rTray4_34,rTray4_35,rTray4_36,rTray4_37,rTray4_38,rTray4_39,rTray4_40,rTray4_41,rTray4_42,rTray4_43,rTray4_44,rTray4_45,rTray4_46,rTray4_47,rTray4_48,rTray4_49,rTray4_50,rTray4_51,rTray4_52,rTray4_53,rTray4_54,rTray4_55,rTray4_56,rTray4_57,rTray4_58,rTray4_59,rTray4_60,rTray4_61,rTray4_62,rTray4_63,rTray4_64,rTray4_65,rTray4_66,rTray4_67,rTray4_68,rTray4_69,rTray4_70"

str_select['balance'][0] = "bTray1_01,bTray1_02,bTray1_03,bTray1_04,bTray1_05,bTray1_06,bTray1_07,bTray1_08,bTray1_09,bTray1_10,bTray1_11,bTray1_12,bTray1_13,bTray1_14,bTray1_15,bTray1_16,bTray1_17,bTray1_18,bTray1_19,bTray1_20,bTray1_21,bTray1_22,bTray1_23,bTray1_24,bTray1_25,bTray1_26,bTray1_27,bTray1_28,bTray1_29,bTray1_30,bTray1_31,bTray1_32,bTray1_33,bTray1_34,bTray1_35,bTray1_36,bTray1_37,bTray1_38,bTray1_39,bTray1_40,bTray1_41,bTray1_42,bTray1_43,bTray1_44,bTray1_45,bTray1_46,bTray1_47,bTray1_48,bTray1_49,bTray1_50,bTray1_51,bTray1_52,bTray1_53,bTray1_54,bTray1_55,bTray1_56,bTray1_57,bTray1_58,bTray1_59,bTray1_60,bTray1_61,bTray1_62,bTray1_63,bTray1_64,bTray1_65,bTray1_66,bTray1_67,bTray1_68,bTray1_69,bTray1_70"
str_select['balance'][1] = "bTray2_01,bTray2_02,bTray2_03,bTray2_04,bTray2_05,bTray2_06,bTray2_07,bTray2_08,bTray2_09,bTray2_10,bTray2_11,bTray2_12,bTray2_13,bTray2_14,bTray2_15,bTray2_16,bTray2_17,bTray2_18,bTray2_19,bTray2_20,bTray2_21,bTray2_22,bTray2_23,bTray2_24,bTray2_25,bTray2_26,bTray2_27,bTray2_28,bTray2_29,bTray2_30,bTray2_31,bTray2_32,bTray2_33,bTray2_34,bTray2_35,bTray2_36,bTray2_37,bTray2_38,bTray2_39,bTray2_40,bTray2_41,bTray2_42,bTray2_43,bTray2_44,bTray2_45,bTray2_46,bTray2_47,bTray2_48,bTray2_49,bTray2_50,bTray2_51,bTray2_52,bTray2_53,bTray2_54,bTray2_55,bTray2_56,bTray2_57,bTray2_58,bTray2_59,bTray2_60,bTray2_61,bTray2_62,bTray2_63,bTray2_64,bTray2_65,bTray2_66,bTray2_67,bTray2_68,bTray2_69,bTray2_70"
str_select['balance'][2] = "bTray3_01,bTray3_02,bTray3_03,bTray3_04,bTray3_05,bTray3_06,bTray3_07,bTray3_08,bTray3_09,bTray3_10,bTray3_11,bTray3_12,bTray3_13,bTray3_14,bTray3_15,bTray3_16,bTray3_17,bTray3_18,bTray3_19,bTray3_20,bTray3_21,bTray3_22,bTray3_23,bTray3_24,bTray3_25,bTray3_26,bTray3_27,bTray3_28,bTray3_29,bTray3_30,bTray3_31,bTray3_32,bTray3_33,bTray3_34,bTray3_35,bTray3_36,bTray3_37,bTray3_38,bTray3_39,bTray3_40,bTray3_41,bTray3_42,bTray3_43,bTray3_44,bTray3_45,bTray3_46,bTray3_47,bTray3_48,bTray3_49,bTray3_50,bTray3_51,bTray3_52,bTray3_53,bTray3_54,bTray3_55,bTray3_56,bTray3_57,bTray3_58,bTray3_59,bTray3_60,bTray3_61,bTray3_62,bTray3_63,bTray3_64,bTray3_65,bTray3_66,bTray3_67,bTray3_68,bTray3_69,bTray3_70"
str_select['balance'][3] = "bTray4_01,bTray4_02,bTray4_03,bTray4_04,bTray4_05,bTray4_06,bTray4_07,bTray4_08,bTray4_09,bTray4_10,bTray4_11,bTray4_12,bTray4_13,bTray4_14,bTray4_15,bTray4_16,bTray4_17,bTray4_18,bTray4_19,bTray4_20,bTray4_21,bTray4_22,bTray4_23,bTray4_24,bTray4_25,bTray4_26,bTray4_27,bTray4_28,bTray4_29,bTray4_30,bTray4_31,bTray4_32,bTray4_33,bTray4_34,bTray4_35,bTray4_36,bTray4_37,bTray4_38,bTray4_39,bTray4_40,bTray4_41,bTray4_42,bTray4_43,bTray4_44,bTray4_45,bTray4_46,bTray4_47,bTray4_48,bTray4_49,bTray4_50,bTray4_51,bTray4_52,bTray4_53,bTray4_54,bTray4_55,bTray4_56,bTray4_57,bTray4_58,bTray4_59,bTray4_60,bTray4_61,bTray4_62,bTray4_63,bTray4_64,bTray4_65,bTray4_66,bTray4_67,bTray4_68,bTray4_69,bTray4_70"
// --------------------------------------------------------

/* GET home page. */ 
router.get('/:str', async function(req, res, next) {

  let rtnObj = {}
  str_id = req.params.str - 1
  rtnObj.str_lbl = req.params.str
  rtnObj.str_id  = str_id

  for (grp of ['volts','temperature','balance','impedance']) {
    rtnObj[grp] = str_select[grp][str_id]
  }

  res.render('str', rtnObj)

});

/* XHR response */

// Fault and alarm to ID relation
var flt_alm_msg = { 1:'Voltage High!',2:'Voltage Sorta High!',3:'Smoke Detected!',4:'Fire Detected!',5:'Current over threshold' }


// -----------------------------------------------------------
/* XHR str page. */ 
router.get('/xhr/:str', async function(req, res, next) {

  //console.log('cookies ',req.cookies)

  let style = {}
  let innerHTML = {}
  let classList = {}

  // Never should happen but... 
  let str_id = req.params.str - 1

  if ( ! ( str_id >= 0 && str_id <= 3 ) ) {
    console.error(str_id)
    res.json({error: `str_id ${str_id} is outside acceptible range`}) 
  }  

  // Get string data for this str_id
  const sql = `select time,${str_select['volts'][str_id]} from volts order by time desc limit 1;\
  select time,${str_select['temperature'][str_id]} from temperature order by time desc limit 1;\
  select time,${str_select['impedance'][str_id]} from impedance order by time desc limit 1;\
  select time,${str_select['balance'][str_id]} from balance order by time desc limit 1;\
  select * from i_prop_str order by time desc limit 1;`

  const rows = await db.querys(sql)

  innerHTML = {...rows[0][0], ...rows[1][0], ...rows[2][0], ...rows[3][0], ...rows[4][0] }

  // Need to convert nulls to empty string and fix float
  for ( [k,v] of Object.entries(innerHTML)){ 
    if (v==null){innerHTML[k]='&nbsp;'}
    else { innerHTML[k]  = parseFloat(innerHTML[k]).toFixed(2) } 
  }

  // spinner and data times. Impedance is only updated once a day. 
  time = rows[0][0]['time']  // spinner
  innerHTML['timeFmtR'] = new Date(rows[2][0]['time']).toLocaleString('en-US', {hour12: false})

  // --------------------------------------
  // Voltage 
  // --------------------------------------
  let spHighVolt = req.cookies.spHighVolt
  let spLowVolt  = req.cookies.spLowVolt

  var [a,b] = util.tblProc('v',rows[0][0],spHighVolt,spLowVolt)
  innerHTML['volt'] = a
  style['volt'] = b

  // [innerHTML['volt'],style['volt']] = util.tblProc('v',rows[0][0],spHighVolt,spLowVolt)

  // ---- Temperature stats -------------------
  let spHighTemp = req.cookies.spHighTemp
  let spLowTemp  = req.cookies.spLowTemp

  var [a,b] = util.tblProc('t',rows[1][0],spHighTemp,spLowTemp)
  innerHTML['temp'] = a
  style['temp'] = b

  // // ---- Impedance stats ------------------
  let spHighImpedance = req.cookies.spHighImpedance
  let spLowImpedance  = req.cookies.spLowImpedance

  var [a,b] = util.tblProc('r',rows[2][0],spHighImpedance,spLowImpedance)
  innerHTML['impedance'] = a
  style['impedance'] = b

  // ---- Balance stats ------------------
  let spHighBalance = req.cookies.spHighBalance
  let spLowBalance  = req.cookies.spLowBalance

  var [a,b] = util.tblProc('b',rows[3][0],spHighBalance,spLowBalance)
  innerHTML['balance'] = a
  style['balance'] = b

  //if ( req.hdr.fltNum ) { innerHTML.fltBang = '!' }
  //else                  { innerHTML.fltBang = '' }

  innerHTML.fltBang = req.hdr.fltNum ? '!' : ''

  res.json({time:time,innerHTML:innerHTML,style:style,classList:classList}) 
})

function fltBang(fltNum) {
  return (fltNum ? '!' : '');
}

module.exports = router;