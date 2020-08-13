import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

import './InfoBox.css'

function InfoBox({ title, cases, total, active, isRed, isBlack, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoBox ${active && "infoBox--selected"} ${
            isRed && "infoBox--red"
            } ${ isBlack && "infoBox--black"}`}
      >
            <CardContent>
                <Typography className="title" color="textSecondary">
                    {title}
                </Typography>

                <h2 className="cases">{cases}</h2>

                <Typography className="total" color="textSecondary">
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
