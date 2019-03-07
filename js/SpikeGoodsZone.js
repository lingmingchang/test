import React from 'react';
import {ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

import Container from '../../components/Container';
import {apx, baseConfig, loadingStyle, screenWidth} from "../../common/Config";
import HTTP from '../../common/HTTP';
import SpikeSaleGoods from "../../components/SpikeSaleGoods";
import globalStyle from "../../style/GlobalStyle";

/**
 * 秒杀专区
 */
class SpikeGoodsZone extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isMoreData: true,//分页是否有更多的数据
            activityGoods: [],
            params: {
                pageNo: 0,//页码
            },
            loading: true,
            visible: false,
            isLoadFinish: false,
        }
    }

    componentDidMount() {
        this._activityGoods()
    }

    renderHeader() {
        return (
            <View style={[styles.viewCenter, styles.viewTop]}>
                <TouchableOpacity onPress={() => {
                    this.props.navigation.goBack();
                }}>
                    <Image style={styles.topIcon}
                           source={require('../../img/back_white_new.png')}/>
                </TouchableOpacity>
                {/*专题栏目*/}
                <Image style={{width: apx(290), height: apx(40)}} source={require('../../img/time_title2.png')}/>
                <View style={styles.topIcon}/>
            </View>
        )
    }

    render() {
        return (

            <Container style={{flex: 1, backgroundColor: '#f03939'}}>

                {this.renderHeader()}

                <FlatList
                    data={this.state.activityGoods}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}//key
                    renderItem={this._renderItem.bind(this)}
                    onEndReached={() => {
                        this.state.isLoadFinish && this._activityGoods()

                    }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={this._renderFooter.bind(this)}/>

            </Container>


        )
    }

    /***
     * 相对应专题的商品列表
     * @param data
     * @param index
     * @private
     */
    async _activityGoods() {

        if (!this.state.isMoreData) {
            return;
        }

        this.state.isLoadFinish = false;
        this.setState({});

        HTTP.post(HTTP.api.goods.spikeSale, this.state.params.pageNo).then((data) => {

            this.state.isMoreData = !(data.spikeActivityInfoModels.length < 20);//已经没有更多数据加载了
            this.state.activityGoods = this.state.activityGoods.concat(data.spikeActivityInfoModels);
            this.state.isLoadFinish = true;
            if(data.spikeActivityInfoModels.length >= 20) this.state.params.pageNo += 1;
            this.setState({});

        }).catch(err => {
            console.log(err);
            this.setState({
                isLoadFinish: true,
            });
        })

    }

    /***
     * 渲染专题商品列表
     * @param data
     * @returns {Array}
     * @private
     */
    _renderItem(data) {

        const {item, index} = data;

        return (
            <View key={index} style={[globalStyle.center, {marginBottom: apx(20)}]}>
                <SpikeSaleGoods
                    data={item}/>
            </View>
        );
    }

    /***
     * 底部加载提示
     * @returns {*}
     * @private
     */
    _renderFooter() {
        return (
            <View>
                <View style={{alignSelf: 'center', width: screenWidth, marginTop: apx(20)}}>
                    {
                        this.state.isMoreData ?
                            <ActivityIndicator style={loadingStyle.loading}/> :
                            <Text style={styles.noMoreText}>没有更多数据了~</Text>
                    }
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    scrollView: {
        // backgroundColor: "white",
        // borderBottomWidth: borderWidth,
        // borderTopWidth: borderWidth,
        // borderColor: "#dcdcdc",
        // borderStyle: "solid",
    },

    itemTouchable: {
        width: apx(200),
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: apx(40),
    },
    scrollItem: {
        height: apx(80),
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: apx(4),
        borderColor: 'white',
        borderStyle: "solid",
    },
    titleName: {
        fontSize: apx(28),
        color: "white",
        backgroundColor: 'transparent'
    },
    noMoreText: {
        color: '#fff',
        textAlign: 'center',
        margin: 10,
        backgroundColor: "transparent"
    },
    topIcon: {
        width: apx(40),
        height: apx(40),
        marginHorizontal: apx(20),
        backgroundColor: 'transparent'
    },
    viewTop: {
        backgroundColor: 'transparent',
        paddingTop: baseConfig.titlePaddingTop,
        width: apx(750),
        height: baseConfig.titleHeight,
    },
    viewCenter: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default SpikeGoodsZone;
