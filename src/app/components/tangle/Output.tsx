import { Blake2b } from "@iota/crypto.js";
import { BASIC_OUTPUT_TYPE, ALIAS_OUTPUT_TYPE, FOUNDRY_OUTPUT_TYPE, NFT_OUTPUT_TYPE, TREASURY_OUTPUT_TYPE, IOutputResponse, SIMPLE_TOKEN_SCHEME_TYPE, ALIAS_ADDRESS_TYPE, NFT_ADDRESS_TYPE } from "@iota/iota.js";
import { Converter, HexHelper } from "@iota/util.js";
import bigInt from "big-integer";
import classNames from "classnames";
import React, { Component, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ClipboardHelper } from "../../../utils/clipboardHelper";
import { FormatHelper } from "../../../utils/formatHelper";
import { NameHelper } from "../../../utils/nameHelper";
import MessageButton from "../layout/MessageButton";
import { ReactComponent as DropdownIcon } from "./../../../assets/dropdown-arrow.svg";
import Bech32Address from "./Bech32Address";
import FeatureBlock from "./FeatureBlock";
import { OutputProps } from "./OutputProps";
import { OutputState } from "./OutputState";
import UnlockCondition from "./UnlockCondition";

/**
 * Component which will display an output.
 */
class Output extends Component<OutputProps, OutputState> {
    /**
     * Create a new instance of Output.
     * @param props The props.
     */
    constructor(props: OutputProps) {
        super(props);

        this.state = {
            formatFull: false,
            isGenesis: (this.isOutputResponse(props.output))
                    ? props.output.metadata.messageId === "0".repeat(64) : false,
            output: (this.isOutputResponse(props.output)) ? props.output.output : props.output,
            showDetails: false
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="output margin-t-m">
                <div className="card--content padding-0">
                    <div className="card--header row spread">
                        <div
                            className="card--content__input"
                            onClick={() => this.setState({ showDetails: !this.state.showDetails })}
                        >
                            <div className={classNames(
                                    "margin-r-t",
                                    "card--content__input--dropdown",
                                    { "opened": this.state.showDetails }
                                )}
                            >
                                <DropdownIcon />
                            </div>
                            <h3 className="card--content__input--label">
                                {NameHelper.getOutputTypeName(this.state.output.type)} {this.props.index}
                            </h3>
                        </div>
                        <div className="card--value card--value__mono">
                            <button
                                className="card--value--button"
                                type="button"
                                onClick={() => this.setState(
                                    {
                                        formatFull: !this.state.formatFull
                                    }
                                )}
                            >
                                {FormatHelper.getInstance().amount(
                                    Number(this.state.output.amount),
                                    this.state.formatFull
                                )}
                            </button>
                        </div>
                    </div>

                    {this.state.showDetails && (
                        <div className="card--content--border-l">
                            {/* Diplay metadata for Output Response */}
                            {this.isOutputResponse(this.props.output) && (
                                <React.Fragment>
                                    <div className="card--label">
                                        Message Id
                                    </div>
                                    <div className="card--value row">
                                        {this.state.isGenesis && (
                                            <span>Genesis</span>
                                        )}
                                        {!this.state.isGenesis && (
                                            <React.Fragment>
                                                <Link
                                                    to={
                                                        `/explorer/message/${this.props.output.metadata.messageId}`
                                                    }
                                                    className="margin-r-t"
                                                >
                                                    {this.props.output.metadata.messageId}
                                                </Link>
                                                <MessageButton
                                                    onClick={() => {
                                                        if (this.isOutputResponse(this.props.output)) {
                                                            ClipboardHelper.copy(this.props.output.metadata.messageId);
                                                        }
                                                    }}
                                                    buttonType="copy"
                                                    labelPosition="top"
                                                />
                                            </React.Fragment>
                                        )}
                                    </div>
                                    <div className="card--label">
                                        Transaction Id
                                    </div>
                                    <div className="card--value row">
                                        {this.state.isGenesis && (
                                            <span>Genesis</span>
                                        )}
                                        {!this.state.isGenesis && (
                                            <React.Fragment>
                                                <span className="margin-r-t">
                                                    {this.props.output.metadata.transactionId}
                                                </span>
                                                <MessageButton
                                                    onClick={() => {
                                                        if (this.isOutputResponse(this.props.output)) {
                                                            ClipboardHelper.copy(
                                                                this.props.output.metadata.transactionId
                                                            );
                                                        }
                                                    }}
                                                    buttonType="copy"
                                                    labelPosition="top"
                                                />
                                            </React.Fragment>
                                        )}
                                    </div>
                                    <div className="card--label">
                                        Index
                                    </div>
                                    <div className="card--value">
                                        {this.props.output.metadata.outputIndex}
                                    </div>
                                    <div className="card--label">
                                        Is Spent
                                    </div>
                                    <div className="card--value">
                                        {this.props.output.metadata.isSpent ? "Yes" : "No"}
                                    </div>
                                </React.Fragment>
                            )}

                            {this.state.output.type === ALIAS_OUTPUT_TYPE && (
                                <React.Fragment>
                                    <Bech32Address
                                        activeLinks={true}
                                        showHexAddress={false}
                                        address={
                                            {
                                                aliasId: this.resolveId(this.state.output.aliasId),
                                                type: ALIAS_ADDRESS_TYPE
                                            }
                                        }
                                    />
                                    <div className="card--label">
                                        State index:
                                    </div>
                                    <div className="card--value row">
                                        {this.state.output.stateIndex}
                                    </div>
                                    <div className="card--label">
                                        State metadata:
                                    </div>
                                    <div className="card--value row">
                                        {this.state.output.stateMetadata}
                                    </div>
                                    <div className="card--label">
                                        Foundry counter:
                                    </div>
                                    <div className="card--value row">
                                        {this.state.output.foundryCounter}
                                    </div>
                                </React.Fragment>
                            )}

                            {this.state.output.type === NFT_OUTPUT_TYPE && (
                                <Bech32Address
                                    activeLinks={true}
                                    showHexAddress={false}
                                    address={
                                            {
                                                nftId: this.resolveId(this.state.output.nftId),
                                                type: NFT_ADDRESS_TYPE
                                            }
                                        }
                                />
                            )}

                            {this.state.output.type === FOUNDRY_OUTPUT_TYPE && (
                                <React.Fragment>
                                    <div className="card--label">
                                        Serial number:
                                    </div>
                                    <div className="card--value row">
                                        {this.state.output.serialNumber}
                                    </div>
                                    <div className="card--label">
                                        Token scheme type:
                                    </div>
                                    <div className="card--value row">
                                        {this.state.output.tokenScheme.type}
                                    </div>
                                    {this.state.output.tokenScheme.type === SIMPLE_TOKEN_SCHEME_TYPE && (
                                        <React.Fragment>
                                            <div className="card--label">
                                                Minted tokens:
                                            </div>
                                            <div className="card--value row">
                                                {this.state.output.tokenScheme.mintedTokens}
                                            </div>
                                            <div className="card--label">
                                                Melted tokens:
                                            </div>
                                            <div className="card--value row">
                                                {this.state.output.tokenScheme.meltedTokens}
                                            </div>
                                            <div className="card--label">
                                                Maximum supply:
                                            </div>
                                            <div className="card--value row">
                                                {this.state.output.tokenScheme.maximumSupply}
                                            </div>
                                        </React.Fragment>
                                    )}
                                </React.Fragment>
                            )}

                            {/* all output types except Treasury have common output conditions */}
                            {this.state.output.type !== TREASURY_OUTPUT_TYPE && (
                                <React.Fragment>
                                    {this.state.output.unlockConditions.map((unlockCondition, idx) => (
                                        <UnlockCondition
                                            key={idx}
                                            unlockCondition={unlockCondition}
                                        />
                                    ))}
                                    {this.state.output.featureBlocks.map((featureBlock, idx) => (
                                        <FeatureBlock
                                            key={idx}
                                            featureBlock={featureBlock}
                                        />
                                    ))}
                                    {this.state.output.type !== BASIC_OUTPUT_TYPE &&
                                    this.state.output.immutableFeatureBlocks && (
                                        <React.Fragment>
                                            {this.state.output.immutableFeatureBlocks
                                                .map((immutableFeatureBlock, idx) => (
                                                    <FeatureBlock
                                                        key={idx}
                                                        featureBlock={immutableFeatureBlock}
                                                    />
                                            ))}
                                        </React.Fragment>
                                    )}
                                    {this.state.output.nativeTokens.map((token, idx) => (
                                        <React.Fragment key={idx}>
                                            <div className="native-token padding-t-s">
                                                <h3>Native token</h3>
                                                <div className="card--label">
                                                    Token id:
                                                </div>
                                                <div className="card--value row">
                                                    {token.id}
                                                </div>
                                                <div className="card--label">
                                                    Amount:
                                                </div>
                                                <div className="card--value row">
                                                    {token.amount}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            )}

                        </div>
                    )}

                </div>
            </div>
        );
    }

    /**
     * Check if object is type of IOutputResponse.
     * @param object The object to check.
     * @returns True of object is IOutputResponse.
     */
    private isOutputResponse(object: unknown): object is IOutputResponse {
        return Object.prototype.hasOwnProperty.call(object, "messageId");
    }

    /**
     * Check if id is all 0 because it hasn't moved and compute it as a hash of the outputId.
     * @param id The id to resolve.
     * @returns The correct id.
     */
    private resolveId(id: string): string {
        return !HexHelper.toBigInt256(id).eq(bigInt.zero)
            ? id
            : HexHelper.addPrefix(Converter.bytesToHex(
                Blake2b.sum256(Converter.hexToBytes(HexHelper.stripPrefix(this.props.outputId)))
            ));
    }
}

export default Output;
