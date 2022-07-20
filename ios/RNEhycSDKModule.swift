//
//  RNEhycSDKModule.swift
//  RNEhycSDKModule
//
//  Copyright © 2022 Sphinx Jsc. All rights reserved.
//

import Foundation

@objc(RNEhycSDKModule)
class RNEhycSDKModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
