import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { resetWalkthrough } from '../../languageSelection/actions'
import { store } from '../../../common/store'
import I18n from '../../../i18n'
import { TITLE_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from '../../../assets/color'
import { FONT_BOLD, FONT_SEMIBOLD, FONT_REGULAR, FONT_MEDIUM, FONT_LIGHT, FONT_EXTRA_LIGHT } from '../../../assets/fonts'
import { connect } from 'react-redux'
const Tooltip = ({
    isFirstStep,
    isLastStep,
    handleNext,
    handlePrev,
    handleStop,
    currentStep,
    labels,
    isHomePage
}) => (
        <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text testID="stepDescription" style={{ fontFamily: FONT_BOLD, fontSize: 25, color: SECONDARY_COLOR }}>{currentStep.name}</Text>
                <TouchableOpacity onPress={() => {handleStop(),store.dispatch(resetWalkthrough())}}
                >
                    <AntDesign name="close" color={TITLE_COLOR} size={20} />
                </TouchableOpacity>
            </View>
            <View style={styles.tooltipContainer}>
                <View style={{ justifyContent: 'flex-start' }}>
                    <Text testID="stepDescription" style={styles.tooltipText}>{currentStep.text}</Text>
                </View>
            </View>
            <View style={[styles.bottomBar]}>
                {
                    !isLastStep ?
                        // <TouchableOpacity onPress={handleStop} style={{ justifyContent: 'flex-end' }}>
                        //     <Text style={{ color: PRIMARY_COLOR }}>{labels.skip || 'Skip'}</Text>
                        // </TouchableOpacity>
                        null
                        : null
                }
                {
                    !isFirstStep ?
                        <TouchableOpacity onPress={handlePrev} style={{}} >
                            <Text style={styles.next}>{labels.previous || "Previous"}</Text>
                        </TouchableOpacity>
                        : null
                }
                {
                    !isLastStep ?
                        <TouchableOpacity onPress={handleNext} style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={styles.next}>{labels.next || "Next"}</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => {
                            if (isHomePage) {
                                store.dispatch(resetWalkthrough())
                                handleStop()
                            }
                            else {
                                console.log("isShowWalkThrough False", isHomePage)
                                store.dispatch(resetWalkthrough())
                                handleStop()
                            }
                        }}
                            style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.next}>{labels.finish || "Okay_Got_it"}</Text>
                        </TouchableOpacity>
                }
            </View>
        </View>
    );
const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
    },
    tooltipContainer: {
        justifyContent: 'center',
        height: 90,
        width: '90%',
        backgroundColor: '#FFFFFF',
        marginRight: 10
    },
    tooltipText: {
        fontFamily: FONT_REGULAR,
        paddingBottom: 25,
        color: 'grey',
        marginRight: 10,
    },
    next:
    {
        color: PRIMARY_COLOR,
        fontFamily: FONT_BOLD,
        fontSize: 14,
        flex: 1
    }
})
export default Tooltip;
const style = {
    position: 'absolute',
    paddingTop: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 13,
    overflow: 'hidden',
    marginTop: 40,
};
// export default connect(mapStateToProps)((copilot(
//     {
//         tooltipComponent: (props) => <ToolTip {...props} isHomePage={true} />,
//         svgMaskPath: circleSvgPath,
//         stepNumberComponent: StepNumber,
//         tooltipStyle: style,
//         animated: true,
//         overlay: 'svg',
//     })(App)))