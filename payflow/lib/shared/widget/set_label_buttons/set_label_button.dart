
import 'package:flutter/material.dart';
import 'package:payflow/shared/themes/app_colors.dart';
import 'package:payflow/shared/themes/app_text_styles.dart';
import 'package:payflow/shared/widget/divider_vertical/divider_vertical_widget.dart';
import 'package:payflow/shared/widget/label_button/label_button.dart';

class SetLabelButtons extends StatelessWidget {
  final String firstLabel;
  final VoidCallback firstOnPress;
  final String secondLabel;
  final VoidCallback secondsOnPress;

  final bool highlightFirst;
  final bool highlightSecond;

  const SetLabelButtons({
    Key? key,
    required this.firstLabel,
    required this.firstOnPress,
    required this.secondLabel,
    required this.secondsOnPress,
    this.highlightFirst = false,
    this.highlightSecond = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final highlightStyle = TextStyles.buttonPrimary;

    final firstButton = Expanded(
      child: LabelButton(
        label: this.firstLabel,
        onPressed: this.firstOnPress,
        style: this.highlightFirst ? highlightStyle : null,
      )
    );
    final dividerVertical = DividerVerticalWidget();
    final secondButton = Expanded(
      child: LabelButton(
        label: this.secondLabel,
        onPressed: this.secondsOnPress,
        style: this.highlightSecond ? highlightStyle : null,
      )
    );
    
    return Container(
      color: AppColors.background,
      height: 57,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Divider(
            thickness: 1,
            height: 1,
            color: AppColors.stroke
          ),
          Container(
            height: 56,
            child: Row(
              children: [
                firstButton,
                dividerVertical,
                secondButton
              ]
            ),
          ),
        ],
      )
    );
  }
}
