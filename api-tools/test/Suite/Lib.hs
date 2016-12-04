module Suite.Lib where

import Test.Hspec as T
import Test.QuickCheck as T
import Test.Hspec.QuickCheck as T

test :: IO ()
test = hspec $ do
   describe "" $ do
      print "Test suite not yet implemented"

